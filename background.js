// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

// 设置图标彩色、灰色
chrome.runtime.onInstalled.addListener(function () {
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {
    const rules = [
      {
        conditions: [new chrome.declarativeContent.PageStateMatcher({
          pageUrl: { hostEquals: 'gitlab.qima-inc.com', pathSuffix: '/branches' },
        })],
        actions: [new chrome.declarativeContent.ShowPageAction()],
      }
    ];

    chrome.declarativeContent.onPageChanged.addRules(rules);
  });
});

chrome.runtime.onMessage.addListener(
  function (message, callback) {
    console.log({ message });
    if (message == 'changeColor') {
      chrome.tabs.executeScript({
        code: 'document.body.style.backgroundColor="orange"'
      });
    }
  }
);

// 跳转 https
chrome.webRequest.onBeforeRequest.addListener(function (details) {
  const { tabId, url } = details;
  if (url.startsWith('http:')) {
    chrome.tabs.update(tabId, {
      url: url.replace('http:', 'https:'),
    });
  }
}, {
  urls: [
    "http://gitlab.qima-inc.com/*",
    "https://gitlab.qima-inc.com/*",
  ],
});

// gitlab branch 页面默认按 update_time 排序
chrome.webRequest.onBeforeRequest.addListener(function (details) {
  const { tabId, url } = details;
  if (details.method === 'GET' && !/commit/.test(url)) {
    const { searchParams, origin, pathname, hash } = new URL(url);
    if (!searchParams.has('sort')) {
      searchParams.append('sort', 'updated_desc');
      chrome.tabs.update(tabId, {
        url: `${origin}${pathname}?${searchParams.toString()}${hash}`,
      });
    }
  }
}, {
  urls: ["https://gitlab.qima-inc.com/*/branches"],
});


// 新建 branch 会走 post 请求，导致请求被干掉
// gitlab branch 页面默认按 update_time 排序
// chrome.webNavigation.onBeforeNavigate.addListener(function (details) {
//   const { tabId, url } = details;
//   const { searchParams, origin, pathname, hash } = new URL(url);
//   if (!searchParams.has('sort')) {
//     searchParams.append('sort', 'updated_desc');
//     console.log('onBeforeNavigate', details);
//     chrome.tabs.update(tabId, {
//       url: `${origin}${pathname}?${searchParams.toString()}${hash}`,
//     });
//   }
// }, {
//   url: [
//     { hostEquals: 'gitlab.qima-inc.com', pathSuffix: '/branches' },
//   ]
// });
