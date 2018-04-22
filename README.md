<p align="center">
    <img src="src/assets/images/communikey-logo-light.svg.png"/>
</p>

<p align="center">
    <img src="https://api.travis-ci.org/communicode/communikey-frontend.svg?branch=master"/>
    <img src="https://img.shields.io/badge/release-0.17.3-blue.svg"/>
</p>

# communikey (frontend)

A simple, centralized, teambased, cross-platform credential manager using GPG encryption.

**This repository is the frontend part of the communikey application. If you want to run communikey yourself, follow the setup guide of both repositories**

## Prerequisites

You will need the following things setup & ready for communikey-frontend to work:

- [npm](https://www.npmjs.com/get-npm)
- [Node.js](https://nodejs.org/en/)


## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

- Clone the project using your favorable way of cloning a github project.

- Move into the project root folder

- execute ``` npm install ``` & wait for the process to finish

- execute ``` npm run dev ```

- **Please note that, if you are planning to run the whole application (front&backend). Start the backend first, otherwise the node process will steal the backend port.**

- For setup of the backend, see the corresponding repository [here](https://github.com/communicode/communikey-backend#getting-started)

## Running tests

- Move into the project root folder and run the following command
  
-  ``` npm run test```

- To update the snapshots, which tests are run against run ``` npm run test:watch``` and press ```u```

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/communicode/communikey-frontend/tags).

## Built With

* [React](https://reactjs.org/) - Javascript library
* [Ant Design](https://ant.design/) - UI library
* [npm](https://www.npmjs.com/) - Node package manager

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests to us.

## License

This project is licensed under the GPLv3 license see the [LICENSE.md](LICENSE.md) file for details.


