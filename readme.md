# 🌿NLU Movies

Ứng dụng tra cứu thông tin phim

[Tải về]() ▪ [Tài liệu]()

## **Mục lục**

- [List Item 1]()
  - [Mini]()
  - [Mini]()
  - [Mini]()
  - [Mini]()
- [List Item 2]()
- [List Item 3]()

## **Tính năng**

- Tính năng 1
- Tính năng 2
- Tính năng 3
- Tính năng 4

## **Hỗ trợ**

| ![Google Chrome](https://raw.githubusercontent.com/alrra/browser-logos/main/src/chrome/chrome_48x48.png) | ![Firefox](https://raw.githubusercontent.com/alrra/browser-logos/main/src/firefox/firefox_48x48.png) |
| -------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| Mới nhất ✅                                                                                              | Mới nhất ✅                                                                                          |

## **Cách cài đặt**

Package Manger

    $ npm install nlu-movies

## **Ví dụ**

```javascript
import axios from "axios";
//const axios = require('axios'); // legacy way

// Make a request for a user with a given ID
axios
  .get("/user?ID=12345")
  .then(function (response) {
    // handle success
    console.log(response);
  })
  .catch(function (error) {
    // handle error
    console.log(error);
  })
  .finally(function () {
    // always executed
  });

// Optionally the request above could also be done as
axios
  .get("/user", {
    params: {
      ID: 12345,
    },
  })
  .then(function (response) {
    console.log(response);
  })
  .catch(function (error) {
    console.log(error);
  })
  .finally(function () {
    // always executed
  });

// Want to use async/await? Add the `async` keyword to your outer function/method.
async function getUser() {
  try {
    const response = await axios.get("/user?ID=12345");
    console.log(response);
  } catch (error) {
    console.error(error);
  }
}
```


5 phần
1.Giới thiêuj bài toán
Anh Đức Lê
10:57
2. Kiến thức cần cóa (lướt) style, componenet, state, props, hook cơ bản
nếu migrate ts thì nói, ko thì thôi
3. Đa luồng
4. Triển khai thực tế
chia folder, sắp xếp cấu trúc, quản lý types
5 demo, xuất ra apk thì ok