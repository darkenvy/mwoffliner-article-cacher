# mwOffliner Article Cacher
This is a Man-in-the-Middle proxy which caches articles that are being served to mwOffliner. The proxy sits in between mwOffliner and the internet.

# Advantages
- saves time in the event of a halt/crash of mwOffliner
- saves time in subsequent zim creation that vary in sizes (100k -> 50k, ect)
- debugging

# How to use:
- Always restart this server each time mwUrl changes. mwOffliner likes to request partial domains (such as `/media/file.jpg`) and this software deduces the host on initialization. If you switch hosts, restart the caching server.
- Prefix your mwUrl parameter with "http://localhost:1271/

  `--mwUrl="https://en.wikipedia.org/"`

  becomes...

  `--mwUrl="http://localhost:1271/https://en.wikipedia.org/"`

# Note
Cache invalidation is up to you. Since the directory size can get out of hand fast, it is advised to utilize `find` for file deletion as it is orders of magnitude faster than `rm`. `find cache/ -type f -delete`
