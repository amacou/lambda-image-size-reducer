# lambda-image-size-reducer

### deploy
```
make deploy
```

### build mozjpeg(cjpeg)

```
make build_mozjpg
```
or
```
docker build build/docker/ -f build/docker/Dockerfile.mozjpeg -t mozjpeg-builder
docker run -it -v `pwd`/bin/linux:/tmp/linux mozjpeg-builder cp /mozjpeg/cjpeg /tmp/linux/cjpeg
```


### build pngquant
```
make build_pngquant
```
or
```
docker build build/docker/ -f build/docker/Dockerfile.pngquant -t pngquant-builder
docker run -it -v `pwd`/bin/linux:/tmp/linux pngquant-builder cp /pngquant/pngquant /tmp/linux/pngquant
```
