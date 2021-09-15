# EinsModal

<p align="center">
<a target="_blank" href="https://www.einscms.com/modal"><img style="width: 100%; max-width: 1080px;" src="https://www.einscms.com/modal/assets/images/logo-w-1080.png"></a>
</p>

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

# The last modal / alert / dialog you will ever need!

## Full Documentation: [https://www.einscms.com/modal](https://www.einscms.com/modal)

EinsModal is the best solution to interact with your users.

It works on every browser and device! (Internet Explorer >= 9)

"Eins" is german and means "one".

This software is part of the Eins-Software-Family.

Every Eins-Software-Product aims to be the one and only software solution you will ever need regarding its task.

## Why EinsModal?

There are many other modal / dialog / popup libraries out there and we tried some of them. 

So what is the need and purpose of this library?

We needed a solution that is **production ready**, **easy to use**, **extensible** and has **beautiful design and animation**.

1. Animations and Design

    EinsModal has **50 animations / transitions** and a **Dark & Light theme** build in.

    Most of the Libraries out there lack good looking design and/or have no or poor animations.

2. Browser Support

    EinsModal is **responsive** (all device sizes) and **works on all browsers** (>= IE9)!

    Almost all other libraries lack support for legacy browsers like IE9 and they also have bugs in newer browsers.

3. Production Ready

    EinsModal is production ready and stable.

    We sometimes need a Modal to display or provide critical information and functionality to our users. So it has to work 100% of the time. Bugs are not acceptable.

4. Easy to use

    EinsModal **can be used without any javascript knowledge**.

    Most of the other libraries can only be used and configured by writing your own javascript code.

5. Extensibility 

    EinsModal provides a developer-friendly api that allows you to extend and use the libraries in many different ways.

    It also has just a small amount of CSS / SCSS. Overriding or extending it is very easy!

## Features

- 🚀 **No Javascript knowledge required**

  You just need to know how to copy and paste HTML!

- ⚡ **Created with pure Javascript**

  Just javascript, no framework used!

- 👻 **Lightweight**

  `eins-modal` is **26 KB** (gzipped) \
  `eins-modal-plain` is **8 KB** (gzipped)

- ✏️ **Well documented**
    
  The documentation also has a Modal-Generator 😍

- 💪 **Actively Maintained**

  The software is always up to date!

- 🌈 **Works with all mobile and desktop Browsers**

  Internet Explorer >= 9

- 🍰 **Easy to use and robust**

  Eating a cake is more difficult than using EinsModal 😂

- 😎 **Can display every kind of HTML**

  Yes, it can!

- 🔥 **Easy to Customize & Extend**

  EinsModal has just a small amount of CSS. Means overriding it or extending it is very easy!

  You can also use the SCSS file if you want to.

  EinsModal provides everything you need to interact with it via JS. There are no limits regarding extending and using it!

- 🌚 **Dark theme build in**

  Dark theme is already build in. Modifying it or adding new themes is very easy!


## Installation

### With NPM

[eins-modal](https://www.npmjs.com/package/eins-modal)
```bash
npm install eins-modal
```

```javascript
// scss
import 'eins-modal/src/scss/style.scss'
// OR css
import 'eins-modal/dist/css/eins-modal.min.css'

// javascript
import EinsModal from 'eins-modal';
// OR
import 'eins-modal';
```

### Without NPM

## <a target="_blank" href="https://github.com/EinsCMS/eins-modal/archive/refs/heads/master.zip">Download</a>


```html
<head>
  <!-- In Head Tag -->
  <link rel="stylesheet" href="/path/to/dist/css/eins-modal.min.css">
</head>
<body>
  <!-- End Of Body Tag -->
  <script src="/path/to/dist/js/eins-modal.min.js"></script>
</body>
```

### EinsModal without animations (eins-modal-plain)

If you want a **smaller file size** and just need a modal you can use EinsModal without any animations.

#### With NPM

[eins-modal](https://www.npmjs.com/package/eins-modal)
```bash
npm install eins-modal
```

```javascript
// scss
import 'eins-modal/src/scss/style.scss'
// OR css
import 'eins-modal/dist/css/eins-modal.min.css'

// javascript
import EinsModal from 'eins-modal/src/eins-modal-plain';
// OR
import 'eins-modal/src/eins-modal-plain';
```

#### Without NPM

## <a target="_blank" href="https://github.com/EinsCMS/eins-modal/archive/refs/heads/master.zip">Download</a>


```html
<head>
  <!-- In Head Tag -->
  <link rel="stylesheet" href="/path/to/dist/css/eins-modal.min.css">
</head>
<body>
  <!-- End Of Body Tag -->
  <script src="/path/to/dist/js/eins-modal-plain.min.js"></script>
</body>
```

## Type definitions / Typescript

EinsModal provides type definitions. They are especially helpful when using Typescript.

Just install the following package to get the type definitions:

[@types/eins-modal](https://www.npmjs.com/package/@types/eins-modal)
```bash
npm install --save-dev @types/eins-modal
```

## Author

- [Timucin Ünal](https://www.goodsoft.de)

## License

This project is open source and available under the [MIT License](LICENSE).


## You can find Examples and more here:
## [https://www.einscms.com/modal](https://www.einscms.com/modal)