import axios from "axios"; // Axios requests
import client from "data/index"; // GraphQL client
import chrome from "chrome-aws-lambda"; // Chromium settings
import puppeteer from "puppeteer-core"; // Puppeteer core
import { getPostByID } from "@data/functions"; // Query function
import { ZORA_MEDIA_BY_OWNER } from "data/queries"; // Query utils

/**
 * Generates HTML page from media and address template
 * @param {String} media highlighted image media
 * @param {String} address profile address
 */
const generateHTML = (media, address) => {
  return `
  <html>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap');
      
      * {
        margin: 0;
        padding: 0;
      }
      
      html {
        width: 1200px;
        height: 600px;
        background-color: #fff;
        font-family: 'Poppins', sans-serif;
      }

      .zora {
        width: 70px;
        height: 70px;
        position: absolute;
        top: 25px;
        left: 25px;
      }

      .highlight {
        height: 400px;
        width: auto;
        margin-top: 100px;
      }

      .address {
        font-size: 30px;
        top: 45px;
        left: 110px;
        position: absolute;
      }
    </style>
    <div>
      <img class="zora" src="https://zora.gallery/logo_orb.png" alt="Orb" />
      <h2 class="address">${
        address.substr(0, 5) + "..." + address.slice(address.length - 5)
      }
      </h2>
      <center>
        <img class="highlight" src="data:image/png;base64, ${media}" />
      </center>
    </div>
  </html>
  `;
};

/**
 * Generates screenshot of html page
 */
const getScreenshot = async ({ html, type = "png" }) => {
  // Launch puppeteer browser
  const browser = await puppeteer.launch({
    // With chrome default args
    args: chrome.args,
    executablePath: await chrome.executablePath,
    headless: false,
  });

  // Make new page
  const page = await browser.newPage();

  // Set content to generated html, wait for image load
  await page.setContent(html, { waitUntil: "networkidle0" });
  const element = await page.$("html");

  // Take screenshot to png form
  return await element.screenshot({ type }).then(async (data) => {
    // Close browser and return screenshot
    await browser.close();
    return data;
  });
};

export default async (req, res) => {
  const { address } = req.query; // Collect address from request query

  // If address not present, throw error
  if (!address) {
    res.status(404).end();
  }

  // Collect posts
  const allPosts = await client.request(
    // By address
    ZORA_MEDIA_BY_OWNER(address.toLowerCase())
  );

  let ownedMedia = [];
  for (let i = 0; i < allPosts.medias.length; i++) {
    // Collect postID
    const postID = allPosts.medias[i].id;

    // FIXME: hardcoded fix for /dev/null lmao
    if (postID !== "2") {
      // Collect post
      const post = await getPostByID(allPosts.medias[i].id);
      // Push post to ownedMedia
      ownedMedia.push(post);
    }
  }

  // Filter posts array for only images
  ownedMedia = ownedMedia.filter((post) =>
    post.metadata.mimeType.startsWith("image")
  );

  // If there is at least 1 image
  if (ownedMedia.length > 0) {
    // Collect the base64 of the image
    const image = await getBase64(ownedMedia[0].contentURI);

    // Generate page html and take screenshot
    const html = generateHTML(image, address);
    const result = await getScreenshot({ html });

    // Return screenshot
    res.writeHead(200, { "Content-Type": "image/png" });
    res.end(result);
  } else {
    // Else, collect base64 of default meta
    const image = Buffer.from(
      getBase64("https://zora.gallery/meta.png"),
      "base64"
    );

    // Return screenshot
    res.writeHead(200, { "Content-Type": "image/png" });
    res.end(image);
  }
};

/**
 * Returns media contentURI as Base64
 * @param {String} url of media
 */
async function getBase64(url) {
  return axios
    .get(url, {
      // Collect as ArrayBuffer
      responseType: "arraybuffer",
    })
    .then((response) =>
      // Convert response to base64
      Buffer.from(response.data, "binary").toString("base64")
    );
}
