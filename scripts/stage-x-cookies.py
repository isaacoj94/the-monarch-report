#!/usr/bin/env python3
"""SQLite-consistent Chrome cookie staging without reading cookie payload columns."""

import os
import sqlite3
import stat
import sys
from urllib.parse import quote


def main() -> int:
    if len(sys.argv) != 3:
        return 2
    os.umask(0o077)
    source, destination = map(os.path.abspath, sys.argv[1:])
    source_stat = os.lstat(source)
    if stat.S_ISLNK(source_stat.st_mode) or not stat.S_ISREG(source_stat.st_mode):
        return 2
    if source_stat.st_uid != os.getuid() or os.path.lexists(destination):
        return 2

    source_uri = f"file:{quote(source)}?mode=ro"
    source_db = sqlite3.connect(source_uri, uri=True, timeout=10)
    destination_db = sqlite3.connect(destination, timeout=10)
    try:
        source_db.backup(destination_db)
        destination_db.execute("DELETE FROM cookies WHERE host_key NOT IN ('x.com', '.x.com')")
        destination_db.commit()
        destination_db.execute("PRAGMA journal_mode=DELETE")
        destination_db.execute("VACUUM")
        destination_db.commit()
    finally:
        destination_db.close()
        source_db.close()
    for suffix in ('-wal', '-shm'):
        try:
            os.unlink(destination + suffix)
        except FileNotFoundError:
            pass
    os.chmod(destination, 0o600)
    return 0


if __name__ == '__main__':
    try:
        raise SystemExit(main())
    except Exception:
        # The caller emits only a stable error code; never expose paths or DB details.
        raise SystemExit(1)
