# cf-google-drive

[![demo](https://user-images.githubusercontent.com/99479536/215351761-99973489-f428-436d-80d3-7d2acdb54b91.png)](https://cf-google-drive-demo.pages.dev)

> demo might be using outdated version.

## Features

- [x] Basic file listing and direct download
- [ ] Streamlined deployment
- [ ] Authentication
- [ ] API support
- [ ] Beautiful frontend

## Setup

0. Get a cloudflare account

Please create one [here](https://dash.cloudflare.com/sign-up) if you haven't already.

1. Clone the repository

```
git clone https://github.com/aynh/cf-google-drive.git
```

2. Install dependecies

```
yarn install
```

3. Configure

Copy `.env.example` into `.env`.

```
cp .env.example .env
```

> Environment variables prefixed with `TEST_` can be ignored, it's only used for development.

Then you can follow [rclone's guide](https://rclone.org/drive/#making-your-own-client-id) to get your own `APP_CLIENT_ID`, `APP_CLIENT_SECRET`, and `APP_REFRESH_TOKEN`. As for `APP_FOLDER_ID`, it's just the id of a google drive folder, for example given the url `https://drive.google.com/drive/folders/1DwpTXJ8jeESB45LWdrThEFW2_9WGaG-3` the folder id would be `1DwpTXJ8jeESB45LWdrThEFW2_9WGaG-3`.

4. Deploy

Build the app.

```
yarn build
```

Deploy using wrangler.

```
yarn wrangler pages publish .svelte-kit/cloudflare
```
