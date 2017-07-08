Run `npm run dev` after completing all [requirement steps](requirement.md). This will start the local webpack development server dynamically using the first available port from `8080` upwards but

**If you're also running the communikey REST API (backend) locally make sure to start it first to prevent port collisions since it uses port `8080` by default!**

The webpack development server proxy configuration can be found in the `webpack.dev.js` file within the `devServer` object.

## Hot Reload
Webpack is configured to support hot reloading out-of-the-box. It listens to any changes in all JavaScript-, JSX, LESSCSS and CSS sources and will automatically recompile.

## Browser Live Reload
The webpack hot reload configuration will trigger a live reload each time a change event occurs.
