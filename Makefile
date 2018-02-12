deploy:
	@if [ -f ./build/ReduceImageSize.zip ]; then rm ./build/ReduceImageSize.zip; fi
	npm install
	zip -r build/ReduceImageSize.zip * -x build
	aws lambda update-function-code --function-name ReduceImageSize --zip-file fileb://`pwd`/build/ReduceImageSize.zip

build_mozjpg:
	docker build build/docker/ -f build/docker/Dockerfile.mozjpeg -t mozjpeg-builder
	docker run -it -v `pwd`/bin/linux:/tmp/linux mozjpeg-builder cp /mozjpeg/cjpeg /tmp/linux/cjpeg

build_pngquant:
	docker build build/docker/ -f build/docker/Dockerfile.pngquant -t pngquant-builder
	docker run -it -v `pwd`/bin/linux:/tmp/linux pngquant-builder cp /pngquant/pngquant /tmp/linux/pngquant
