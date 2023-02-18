const path = require('path')

module.exports = {

    sassOptions: {
      includePaths: [path.join(__dirname, 'styles')],
    },
    reactStrictMode: true,
    images: {
      domains: ['opensea.io', "storage.googleapis.com", "lh3.googleusercontent.com", "img.favpng.com", 
                "www.designyourway.net", "thedreamwithinpictures.com", 'ipfs.infura.io', 
                'payload.cargocollective.com', 'upload.wikimedia.org',
                '139.177.188.72', "95.217.21.156", "localhost"
              ],
    },
    trailingSlash: true,
    react: {
      useSuspense: false,
      wait: true,
    },

}
