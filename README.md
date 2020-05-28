# ColorsApp

_ColorsApp es una aplicación desarrollada con Vue JS para ayudar a los usuarios en su trabajo diario copiando los códigos hexadecimales de los colores dentro de una paleta determinada._

_Puedes ingresar desde estos links:_

[https://miapp.digital/colors](https://miapp.digital/colors) 
_ó_ 
[https://color-app-vue.herokuapp.com/colors](https://color-app-vue.herokuapp.com/colors)

![](https://raw.githubusercontent.com/gonzafg2/ColorsApp/master/colorsapp.png)
_Al hacer clic en un color se ve lo siguiente:_
![](https://raw.githubusercontent.com/gonzafg2/ColorsApp/master/colorsapp2.png)

_La paleta de colores es obtenida a través de una API de prueba._
<!-- ``` -->
[https://reqres.in/api/colors](https://reqres.in/api/colors)

<!-- ``` -->
## Comenzando 🚀

_Estas instrucciones te permitirán obtener una copia del proyecto en funcionamiento en tu máquina local para propósitos de desarrollo y pruebas._

Mira **Deployment** para conocer como desplegar el proyecto.


### Pre-requisitos 📋

_Antes de instalar el proyecto debes tener instalado Node JS en tu máquina local y además un editor de texto para el desarrollo_

***Editor de texto*** _(Recomiendo Visual Studio Code)_
<!-- ``` -->
[https://code.visualstudio.com/](https://code.visualstudio.com/)
<!-- ``` -->
***Node JS*** _(Recomiendo versión LTS)_
<!-- ``` -->
[https://nodejs.org/](https://nodejs.org/)
<!-- ``` -->
***Vue JS y Vue CLI***

[https://vuejs.org/](https://vuejs.org/)

```
$ npm install -g vue
```
[https://cli.vuejs.org/](https://cli.vuejs.org/)
```
$ npm install -g @vue/cli
$ npm install -g @vue/cli-service-global
```
### Instalación 🔧
_Antes de realizar la instalación verifica que tengas instalado correctamente Node JS, npm y Vue, de la siguiente forma:_
```
$node --version
@vue/cli 4.3.1 (Esto debería verse como resultado)
```
```
$npm --version
6.14.5 (Esto debería verse como resultado)
```
```
$vue --version
@vue/cli 4.3.1 (Esto debería verse como resultado)
```
_Para instalar el proyecto debes descargarlo como zip o clonarlo desde esta dirección:_
<!-- ``` -->
[https://github.com/gonzafg2/ColorsApp.git](https://github.com/gonzafg2/ColorsApp.git)
<!-- ``` -->

_Luego de tener los archivos en tu computadora debes instalar node de la siguiente forma. Ejecuta este comando dentro de la carpeta donde están todos los archivos del proyecto_
```
$ npm install
```
_Esto instalará todas las dependencias necesarias para correr la aplicación en tu equipo._

_Luego de esto, se creará una carpeta llamada "node_modules"._

_Si todo salió correctamente puedes ver la app ejecutando el siguiente comando:_
```
$ npm run serve
```
_Esto creará un servidor local para visualizar el proyecto al cual puedes acceder ingresando a alguna de estas direcciones:_ (Pueden ser diferentes en tu equipo)
```
DONE  Compiled successfully in 9051ms 

  App running at:
  - Local:   http://localhost:8080/ 
  - Network: http://192.168.1.81:8080/

  Note that the development build is not optimized.
  To create a production build, run npm run build.
```

## Despliegue 📦

_Puedes hacer deploy ejecutando el siguiente comando en tu terminal:_
```
$ npm run build
```
_Lo que dará como resultado la creación de una carpeta llamada "dist", con los archivos necesarios y minificados para la ejecución en producción._
```
 File                                   Size              Gzipped

  dist/js/chunk-vendors.22378ff0.js      940.40 KiB        246.79 KiB
  dist/js/bundle-colors.0fe9718f.js      18.74 KiB         5.73 KiB
  dist/js/app.ddb23e04.js                5.66 KiB          2.42 KiB
  dist/js/bundle-about.64130b02.js       1.36 KiB          0.68 KiB
  dist/css/chunk-vendors.94bc0478.css    210.20 KiB        30.74 KiB
  dist/css/app.9eac813c.css              145.25 KiB        23.14 KiB
  dist/css/bundle-about.e93e686c.css     0.67 KiB          0.25 KiB

  Images and other types of assets omitted.

 DONE  Build complete. The dist directory is ready to be deployed.
 INFO  Check out deployment instructions at https://cli.vuejs.org/guide/deployment.html
```

## Construido con 🛠️

_En este proyecto se han utilizado las siguientes tecnologías:_

* [HTML5 y CSS3](https://www.w3.org/) - Como lenguajes de etiquetas y estilos.
* [VueJS](https://vuejs.org/) - El framework web escrito en javascript más versátil, simple y amigable de usar.
* [Vue-CLI](https://cli.vuejs.org/) - Herramienta para complementar Vue JS.
* [Vue-Router](https://router.vuejs.org/) - Herramienta para complementar Vue JS.
* [Bootstrap-Vue](https://bootstrap-vue.org/) - Framework para CSS adaptado a las etiquetas de Vue JS.
* [NodeJS y npm](https://nodejs.org/) - Manejador de dependencias.
* [Axios](https://github.com/axios/axios) - Utilizado para realizar llamadas a una API de forma sencilla, basado en promesas.
* [Vue Clipboard](https://www.npmjs.com/package/vue-clipboards) - Usado para realizar el copiado de un elemento al ser clickeado.
* [Heroku](https://www.heroku.com) - Usado para hacer deploy y como hosting de la aplicación.

<!-- ## Contribuyendo 🖇️

Por favor lee el [CONTRIBUTING.md](https://gist.github.com/villanuevand/xxxxxx) para detalles de nuestro código de conducta, y el proceso para enviarnos pull requests. -->

<!-- ## Wiki 📖

Puedes encontrar mucho más de cómo utilizar este proyecto en nuestra [Wiki](https://github.com/tu/proyecto/wiki)

## Versionado 📌

Usamos [SemVer](http://semver.org/) para el versionado. Para todas las versiones disponibles, mira los [tags en este repositorio](https://github.com/tu/proyecto/tags). -->

## Autor ✒️

_Por ahora hay un sólo autor:_

* **Gonzalo Fleming** - *Desarrollo Inicial* - [gonzafg2](https://github.com/gonzafg2)

También puedes mirar la lista de todos los [contribuyentes](https://github.com/your/project/contributors) quíenes han participado en este proyecto. 

## Licencia 📄

Este proyecto está bajo la Licencia MIT - mira el archivo [LICENSE](https://github.com/gonzafg2/ColorsApp/blob/master/LICENSE) para detalles

## Expresiones de Gratitud 🎁

* Puedes comentar a otros sobre este proyecto. 📢
* O invitarme una cerveza 🍺 o un café ☕. 
* O también dar las gracias públicamente 🤓.
* Etc.



---
⌨️ con ❤️ por [GFleming](https://github.com/gonzafg2) 😊
