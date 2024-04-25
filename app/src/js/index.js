// import $ from "jquery";
// import UAParser from "ua-parser-js";
// import jBox from "jbox";
// import mixpanel from "mixpanel-browser";

// try {
//   mixpanel.init(process.env.MIXPANEL_TOKEN || "", {
//     track_pageview: true,
//     persistence: "localStorage",
//   });
// } catch (err) {
//   console.error(err);
// }

console.log("test");

// document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
//   anchor.addEventListener("click", function (e) {
//     e.preventDefault();

//     const element = document.querySelector(this.getAttribute("href"));
//     const elementPosition = element.getBoundingClientRect().top;
//     window.scrollBy({
//       top: elementPosition - 62,
//       behavior: "smooth",
//     });
//   });
// });

// let uaParser = new UAParser(navigator.userAgent);
// let uaParserResults = uaParser.getResult();
// console.log(
//   "User device details for suggesting correct downloads: ",
//   uaParserResults,
// );

// $.getJSON( "https://api.github.com/repos/NiceNode/nice-node/releases/latest", function( data ) {
//   console.log("NiceNode releases api data: ", data);

//   // loop over data.assets, check asset.name and parse out the ones we want to show in the UI.
//   // get asset.browser_download_url
//   $.each(data.assets, function( index, val ) {

//     // mac
//     if(val.name.endsWith('arm64.dmg')) {
//       $("#appleSiliconDownloadLink").attr('href', val.browser_download_url);
//     }
//     if(val.name.endsWith('alpha.dmg')) {
//       $("#appleIntelDownloadLink").attr('href', val.browser_download_url);
//     }

//     // windows
//     if(val.name.endsWith('alpha.exe')) {
//       $("#windowsDownloadLink").attr('href', val.browser_download_url);
//     }

//     // linux
//     if(val.name.endsWith('.deb')) {
//       $("#linuxDebDownloadLink").attr('href', val.browser_download_url);
//     }
//     if(val.name.endsWith('.rpm')) {
//       $("#linuxRpmDownloadLink").attr('href', val.browser_download_url);
//     }
//     if(val.name.endsWith('.AppImage')) {
//       $("#linuxAppImageDownloadLink").attr('href', val.browser_download_url);
//     }
//   });
// });

// Create a jBox tooltip for every element that has class=unstableTooltip,
//  and add class jboxUnstableTooltip to the jBox tooltip when it is created so
//  that we can style the tooltip according to this class
// new jBox("Tooltip", {
//   attach: ".unstableTooltip",
//   addClass: "jboxUnstableTooltip",
//   offset: {
//     x: 0,
//     y: -10,
//   },
// });

// Event reporting
// $('a[download]').on('click', function() {
//   // Report device platform and architecture and whether the correct
//   // download link was used
//   mixpanel.track('DownloadClick', {
//     'uaParserResults' : uaParserResults,
//     'downloadButton' : $(this).attr('id')
//   });
// });
