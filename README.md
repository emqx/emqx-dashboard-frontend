# emqx-dashboard-frontend

This repository is the frontend of [emqx-dashboard](https://github.com/emqx/emqx-dashboard/tree/emqx30/priv/www), it's based on the newest development stack of vue.

[Get Started](https://developer.emqx.io/docs/emq/v3/en/getstarted.html#web-dashboard)



## Usage

Install with yarn or npm

```
yarn

# npm install
```



## Development 

Skip this part if you just want to use Dashboard.


Using local EMQ X broker 

```
npm run dev
```


Specify remote EMQ X broker through environment variables

```
export HOST_URL=http://example.com:18083 && npm run dev
```



Open URL [http://localhost:3000](http://localhost:3000).



## Build

```
npm run build
```

The compiled and packaged static files in `./dist`. Copy them into [emqx-dashboard](https://github.com/emqx/emqx-dashboard/tree/emqx30/priv/www) path `emqx-dashboard/priv/www`.



## Development Framework

- [Vue](https://github.com/vuejs/vue)
- [Element](https://github.com/ElemeFE/element)
- [Font Awesome](https://fontawesome.com/)
- [MQTT.js](https://github.com/mqttjs/MQTT.js#readme)



## License

Copyright (c) 2018 [EMQ Technologies Co., Ltd](https://emqx.io). All Rights Reserved.

Licensed under the Apache License, Version 2.0 (the "License"), you may not use this file except in compliance with the License.You may obtain a copy of the License at

[http://www.apache.org/licenses/LICENSE-2.0](http://www.apache.org/licenses/LICENSE-2.0)


The Font Awesome used in this project is licensed under a [CC BY 4.0 license](https://creativecommons.org/licenses/by/4.0/legalcode)

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.

