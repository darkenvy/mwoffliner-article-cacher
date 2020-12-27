# mwOffliner Article Cacher
This is a Man-in-the-Middle proxy which caches articles that are being served to mwOffliner. The proxy sits in between mwOffliner and the internet.

# Advantages
- saves time in the event of a halt/crash of mwOffliner
- saves time in subsequent zim creation that vary in sizes (100k -> 50k, ect)
- debugging
- When used in conjunction with the s3 cache, time savings can be substantial

# Time Savings
| article count | no cache time | with cache time (s3+proxy)  |
|---------------|---------------|-----------------------------|
| 10            | 00:00:40      | 00:00:13                    |
| 1k            | 00:27:54      |                             |
| 10k           | 05:13:00      | 00:57:49                    |
|               |               |                             |

# requirements
- node v12+

# How to use:
- git clone
- npm install
- npm start
- Prefix your mwUrl parameter with "http://localhost:1271/

  `--mwUrl="https://en.wikipedia.org/"`

  becomes...

  `--mwUrl="http://localhost:1271/https://en.wikipedia.org/"`

# Note
Always restart this server each time mwUrl changes. mwOffliner likes to request partial domains (such as `/media/file.jpg`) and this software deduces the host on initialization. If you switch hosts, restart the caching server.

Cache invalidation is up to you. Since the directory size can get out of hand fast, it is advised to utilize `find` for file deletion as it is orders of magnitude faster than `rm`. `find cache/ -type f -delete`
