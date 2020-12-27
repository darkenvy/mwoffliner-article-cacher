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

# Interface
The terminal output is as follows:

`[dl: 0ms|ca: 0ms:#0] 200 = 0ms : https://en.wikipedia.org/`

`dl` represents the average download time from the internet for all resources of inbound traffic

`ca` represents the average serving time from a cached resource on the hdd.

`#` the number of total requests to this proxy

`200` is the response code for the GET request

`=` means the current resource was served from cache; `-` means the resource was served from the internet. 

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
