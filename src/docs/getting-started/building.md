**Note**: Please make sure to complete the [NodeJS requirement](requirements.md#nodejs) steps first!

The project can be build for the test- and production environments by running the specific `npm` scripts.

**Production**
```sh
npm run dist:prod
```

**Test**
```sh
npm run dist:test
```

The distribution will be placed in the `dist` directory.

## Documentation
![](../assets/gitbook-banner.png)
This [gitbook](https://github.com/GitbookIO/gitbook) can be build by running

```sh
npm run docs:build
```

The distribution will be placed in the `dist/docs` directory.

To start the local hot reload server with browser live reload, using the default port `4000`, run
```sh
npm run docs:serve
```
