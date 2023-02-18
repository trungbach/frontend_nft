import Head from 'next/head';
import Script from 'next/script'

const Meta = ({title, keywords, description}) => {
    return (
        <Head>
            <meta name='viewport' content='width=device-width, initial-scale=1' />
            <meta name='keywords' content={keywords} />
            <meta name='description' content={description} />
            <meta charSet='utf-8' />
            <link rel='icon' href='/icon.png' />
            <title>{title}</title>
        </Head>
    );
}

Meta.defaultProps = {
    title: 'RareX: Buy NFTs, Crypto Collectibles, CryptoKitties, Decentraland, and more on Ethereum',
    keywords: 'RareX: Buy NFTs, Crypto Collectibles, CryptoKitties, Decentraland, and more on Ethereum',
    description: 'Get the lastes new item in RareX'
}

export default Meta;
