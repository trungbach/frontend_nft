import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { create as ipfsHttpClient } from "ipfs-http-client";
import { useRouter } from "next/router";
import Web3Modal from "web3modal";
import Image from "next/image";
import config from "@/config/index";
import { createItem } from "@/pages/api/create";
import NFT from "@/artifacts/contracts/NFT.sol/NFT.json";
import HSNToken from "@/artifacts/contracts/HSNToken.sol/HSNToken.json";
import Market from "@/artifacts/contracts/Market.sol/NFTMarket.json";
import styles from "./style.module.scss";
import { Select, Button, Form, Input } from "antd";
import { getMyCollection } from "@/pages/api/collection";
import Link from "next/link";
import { connect } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import superagent from "superagent";
import { getPercent } from "@/pages/api/config";
import ImageIcon from "@material-ui/icons/Image";
import ipfsClient from "ipfs-http-client";

const { Option } = Select;
// const client = ipfsHttpClient("https://ipfs.infura.io:5001/api/v0");
const projectId = '2951l3177BBMo6glMSVCNKiqLG9'
const projectSecret = "b821986a2b07f43eaac976e9fcf75cbb"
const auth = 'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64');
const client = ipfsClient.create({
    host: 'ipfs.infura.io',
    port: 5001,
    protocol: 'https',
    headers: {
        authorization: auth,
    },
});
export async function getServerSideProps({ req, res }) {
  const listCollection = await getMyCollection({ req, res });
  return {
    props: {
      listCollection,
    },
  };
}

const CreateItem = (props) => {
  const { listCollection, isLoggedIn } = props;
  const [fileUrl, setFileUrl] = useState(null);
  const [thumbUrl, setThumbUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [form] = Form.useForm();
  const [typeMedia, setTypeMedia] = useState();
  const [videoFile, setVideoFile] = useState();
  const [audioFile, setAudioFile] = useState();
  const [percent, setPercent] = useState();

  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/login");
    }
  }, [isLoggedIn]);

  useEffect(() => {
    const getPercentConfig = async () => {
      const percentConfig = await getPercent();
      setPercent(percentConfig);
    };

    getPercentConfig();
  }, []);

  async function loadNFTs() {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    const marketContract = new ethers.Contract(config.nftmarketaddress, Market.abi, signer);
    const data = await marketContract.fetchItemsCreated();
    return data;
  }

  const handleError = (e) => {
    setLoading(false);
    if (e.code == "INSUFFICIENT_FUNDS") {
      toast.error("INSUFFICIENT FUNDS", { position: "top-right", autoClose: 2000 });
      return;
    } else {
      toast.error(e.message, { position: "top-right", autoClose: 2000 });
      return;
    }
  };

  async function createMarket(values) {
    setLoading(true);
    const { name, description, price } = values;
    // /* first, upload to IPFS */
    const data = JSON.stringify({
      name,
      description,
      image: fileUrl,
    });
    console.log('data', data)
    try {
      const added = await client.add(data);
      const url = `https://ipfs.infura.io/ipfs/${added.path}`;
      /* after file is uploaded to IPFS, pass the URL to save it on Polygon */
      createSale(url, values);
    } catch (error) {
      console.log("Error uploading file: ", error);
    }
  }

  async function createSale(url, values) {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    /* next, create the item */
    let contract = new ethers.Contract(config.nftaddress, NFT.abi, signer);
    console.log('transaction prev')
    let transaction = await contract.createToken(url).catch((e) => handleError(e));

    if (transaction === undefined) {
      console.log("create fail");
      return;
    }
    console.log('transaction after')

    let tx = await transaction.wait();
    let event = tx.events[0];
    let value = event.args[2];
    let tokenId = value.toNumber();
    const price = ethers.utils.parseUnits(values.price, "ether");

    /* then list the item for sale on the marketplace */
    contract = new ethers.Contract(config.nftmarketaddress, Market.abi, signer);

    const fee = ethers.utils.parseUnits((Number(values.price) * percent).toString(), "ether");

    if (values.symbol === "ETH") {
      transaction = await contract
        .createMarketItem(config.nftaddress, tokenId, price, { value: fee })
        .catch((e) => handleError(e));
    } else if (values.symbol === "BVT") {
      let contractHSN = new ethers.Contract(config.hsnaddress, HSNToken.abi, signer);
      let approveStatus = true;

      let transactionApprove = await contractHSN
        .approve(config.nftmarketaddress, fee)
        .catch((e) => {
          approveStatus = false;
          handleError(e);
        });
      await transactionApprove.wait();

      if (approveStatus === false) {
        console.log("create fail");
        return;
      }

      transaction = await contract
        .createMarketItemByHSN(config.nftaddress, tokenId, price)
        .catch((e) => handleError(e));
    }

    if (transaction === undefined) {
      console.log("create fail");
      return;
    }

    await transaction.wait();
    const data = await loadNFTs();
    setLoading(false);
    const { name, description, collection_id, image_id, symbol } = values;
    const payload = {
      name,
      description,
      price: values.price,
      image_id: image_id,
      symbol: symbol,
      type: typeMedia,
      collection_id: collection_id.split(",")[0],
      category_id: collection_id.split(",")[1],
      block_id: data[data.length - 1].itemId.toNumber(),
    };
    await createItem(payload);
    router.push("/collections");
    toast.dark("Create item success!", { position: "top-right" });
  }

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
    toast.error("Please fill in required fields!", { position: "top-right", autoClose: 2000 });
  };

  const collections =
    listCollection?.map((item, index) => {
      return (
        <Option key={index} value={`${item.id},${item.category_id}`}>
          {item.name}
        </Option>
      );
    }) || [];

  const labelCollection =
    listCollection.length > 0 ? (
      <div>
        Collection:{" "}
        <Link href="/collection/create?from=/create">
          <a>Create new one?</a>
        </Link>
      </div>
    ) : (
      <div>
        Collection:{" "}
        <Link href="/collection/create?from=/create">
          <a>You don&apos;t have any collections yet, click to create a new one first!</a>
        </Link>
      </div>
    );

  const uploadFile = (url, formData, type) => {
    superagent
      .post(config.NEXT_PUBLIC_API_DOMAIN + url)
      .send(formData)
      .end((err, res) => {
        if (!err) {
          form.setFieldsValue({ image_id: res.body.data.id });
          setFileUrl(res.body.data.original_url);
          setTypeMedia(type);
        } else console.log(err);
      });
  };

  const listTypeMedia = {
    IMAGE: 0,
    AUDIO: 1,
    VIDEO: 2,
    GIF: 3,
  };

  const maxSize = 40000000;

  const fileSelect = async (e) => {
    let file = e.target.files[0];
    // check file size < 40MB
    if (file && file.size > maxSize) {
      toast.warning("Please upload file size < 40MB ", { position: "top-right", autoClose: 2000 });
      return;
    }

    if (file) {
      if (file.type.includes("video/")) {
        setVideoFile(file);
        setTypeMedia(listTypeMedia.VIDEO);
        document.querySelector("#video-source").setAttribute("src", URL.createObjectURL(file));
        document.getElementById("video-element").load();
      } else if (file.type.includes("audio/")) {
        document.querySelector("#audio-source").setAttribute("src", URL.createObjectURL(file));
        document.querySelector("#audio-element").load();
        setTypeMedia(listTypeMedia.AUDIO);
        setAudioFile(file);
      } else if (file.type === "image/gif") {
        let type = listTypeMedia.GIF;
        let formData = new FormData();
        formData.append("original_file", file);
        formData.append("type", type);
        uploadFile("/upload-other-file", formData, type);
      } else if (
        file.type === "image/png" ||
        file.type === "image/jpeg" ||
        file.type === "image/webp" ||
        file.type === "image/svg+xml"
      ) {
        let type = listTypeMedia.IMAGE;
        superagent
          .post(config.NEXT_PUBLIC_API_DOMAIN + "/upload-file")
          .attach("file", file)
          .end((err, res) => {
            if (!err) {
              form.setFieldsValue({ image_id: res.body.data.id });
              setFileUrl(res.body.data.original_url);
              setTypeMedia(type);
            } else console.log(err);
          });
      } else
        toast.error("This file type is not supported!", { position: "top-right", autoClose: 2000 });
    }
  };

  const fileSelectThumb = async (e) => {
    var file = e.target.files[0];
    setThumbUrl(URL.createObjectURL(file));
    form.setFieldsValue({ thumb_image: URL.createObjectURL(file) });
    let originFile = typeMedia == listTypeMedia.VIDEO ? videoFile : audioFile;
    if (file) {
      let formData = new FormData();
      formData.append("original_file", originFile);
      formData.append("thumb_file", file);
      formData.append("type", typeMedia);
      uploadFile("/upload-other-file", formData, typeMedia);
    }
  };

  return (
    <div className={styles.create}>
      <div className="container">
        <h1>
          Create new item{" "}
          {listCollection.length == 0 && (
            <Link href="/collection/create?from=/create" style={{ marginLeft: "3rem" }}>
              <a>(You don&apos;t have any collections yet, click to create a new one first!)</a>
            </Link>
          )}
        </h1>
        <Form
          form={form}
          onFinish={createMarket}
          onFinishFailed={onFinishFailed}
          layout="vertical"
          initialValues={{ symbol: "ETH" }}
        >
          <Form.Item
            className={styles.fileContainer}
            name="image_id"
            label="Image, Video, Audio (File types supported: JPG, PNG, GIF, SVG, MP4, WEBP, MP3, WAV, OGG. Max size: 40 MB)"
            rules={[{ required: true, message: "Please choose your file!" }]}
          >
            <div className={styles.labelForFile}>
              <label className="mb-3" htmlFor="file">
                Drag &amp; drop file <br /> or browse media on your device
              </label>
              <label htmlFor="file">
                <video
                  style={{
                    width: typeMedia == listTypeMedia.VIDEO ? "100%" : 0,
                    height: typeMedia == listTypeMedia.VIDEO ? "100%" : 0,
                  }}
                  autoPlay
                  id="video-element"
                  controls
                >
                  <source id="video-source" type="video/mp4" />
                </video>

                <audio
                  id="audio-element"
                  style={{
                    width: typeMedia == listTypeMedia.AUDIO ? "25rem" : 0,
                    height: typeMedia == listTypeMedia.AUDIO ? "5rem" : 0,
                  }}
                  controls
                  autoPlay
                >
                  <source id="audio-source" type="audio/ogg" />
                  <source id="audio-source" type="audio/mpeg" />
                  <source id="audio-source" type="audio/wav" />
                </audio>

                {(typeMedia == listTypeMedia.IMAGE || typeMedia == listTypeMedia.GIF) && (
                  <Image src={fileUrl} alt={fileUrl} layout="fill" objectFit="cover" />
                )}
              </label>
            </div>
            <input type="file" id="file" accept="image/*,audio/*,video/*" onChange={fileSelect} />
          </Form.Item>
          {(typeMedia == listTypeMedia.VIDEO || typeMedia == listTypeMedia.AUDIO) && (
            <Form.Item
              className={styles.fileContainer}
              name="thumb_image"
              label="Preview image"
              rules={[{ required: true, message: "Please upload your preview image !" }]}
            >
              <div className={styles.labelForFileLogo}>
                {thumbUrl && (
                  <Image
                    unoptimized="true"
                    src={thumbUrl}
                    alt={thumbUrl}
                    layout="fill"
                    objectFit="cover"
                  />
                )}
                <label className={thumbUrl ? styles.labelHidden : ""} htmlFor="fileThumb">
                  <ImageIcon />
                </label>
              </div>

              <input type="file" id="fileThumb" accept="image/*" onChange={fileSelectThumb} />
            </Form.Item>
          )}
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: "Please input item name!" }]}
          >
            <Input placeholder="Item Name" />
          </Form.Item>

          <Form.Item
            label="Blockchain"
            name="symbol"
            rules={[{ required: true, message: "Please choose your blockchain" }]}
          >
            <Select defaultValue="ETH">
              <Option value="ETH">ETH</Option>
              <Option value="BVT">BVT</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="price"
            label="Price"
            rules={[{ required: true, message: "Please input item price!" }]}
          >
            <Input
              type="number"
              min="0.01"
              step="0.01"
              autoComplete="off"
              autoCorrect="off"
              inputMode="decimal"
            />
          </Form.Item>

          <Form.Item
            label="Description"
            name="description"
            rules={[{ required: true, message: "Please input your description" }]}
          >
            <Input.TextArea rows={5} placeholder="Provide a detailed description of your item" />
          </Form.Item>

          <Form.Item
            label={labelCollection}
            name="collection_id"
            rules={[{ required: true, message: "Please choose your collection" }]}
          >
            <Select placeholder="Choose collection">{collections}</Select>
          </Form.Item>

          <Form.Item>
            <Button htmlType="submit" loading={loading} className={styles.secondaryButton}>
              Create
            </Button>
            {loading && (
              <span className={styles.notifyProccess}>
                Please wait... The process may take a few minutes
              </span>
            )}
          </Form.Item>
        </Form>
        <ToastContainer position="top-right" />
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  isLoggedIn: state.login.isLoggedIn,
});

export default connect(mapStateToProps)(CreateItem);
