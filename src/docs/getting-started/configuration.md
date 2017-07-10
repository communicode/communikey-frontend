## Apache HTTP Server
Add the `Rewrite*` matches to the VirtualHost configuration:
```apache
  #...
  <Directory>
    RewriteEngine on
    # Don't rewrite files or directories
    RewriteCond %{REQUEST_FILENAME} -f [OR]
    RewriteCond %{REQUEST_FILENAME} -d
    RewriteRule ^ - [L]
    # Rewrite everything else to the index to allow html5 state links
    RewriteRule ^ index.html [L]
  </Directory>
  #...
```

This tells Apache to serve any files that exist, but just serve `/index.html` rather than a `404: not found` for any non-existing path.
