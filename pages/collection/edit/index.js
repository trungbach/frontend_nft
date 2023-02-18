import React, {useState, useEffect} from 'react';
import styles from './style.module.scss';
import { Button, Select, Form, Input } from 'antd'
import { useRouter } from 'next/router'
import Image from 'next/image'
import {getListCategory} from '@/pages/api/category'
import config from '@/config/index'
import superagent from 'superagent'
import ImageIcon from '@material-ui/icons/Image';
import { connect } from 'react-redux'
import { ToastContainer, toast } from 'react-toastify';
import {getTokenFromServer} from '@/utils/index'
import { getCollectionBySlug, editMyCollection} from '@/pages/api/collection'

const {Option} = Select

export async function getServerSideProps({req, res, query}) {
    
    const token = getTokenFromServer(req, res)
    const collection = await getCollectionBySlug({id: query.id})
    const listCategory = await getListCategory();
  
    return {
        props: {
          collection,
          listCategory
        }
    }
}

const EditCollection = ({collection, listCategory, isLoggedIn}) => {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [logoUrl, setLogoUrl] = useState(collection?.logo_url)
    const [bannerUrl, setBannerUrl] = useState(collection?.cover_url)
    const [form] = Form.useForm();

    useEffect(() => {
      if(!isLoggedIn) {
         router.push('/login')
      }
   },[isLoggedIn])
   
    const fileSelectLogo = async (e) => {
        var file = e.target.files[0];
        if (file) {
            superagent
                .post(config.NEXT_PUBLIC_API_DOMAIN + '/upload-file')
                .attach('file', file)
                .end((err, res) => {
                    if (!err) {
                        form.setFieldsValue({logo_id: res.body.data.id})
                        setLogoUrl(res.body.data.original_url)
                    }
                });
        }
    }

    const fileSelectBanner = async (e) => {
        var file = e.target.files[0];
        if (file) {
            superagent
                .post(config.NEXT_PUBLIC_API_DOMAIN + '/upload-file')
                .attach('file', file)
                .end((err, res) => {
                    if (!err) {
                        form.setFieldsValue({cover_id: res.body.data.id})
                        setBannerUrl(res.body.data.original_url)
                    }
                });
        }
    }

    const categories = listCategory?.map((item, index) => {
        return (
          <Option key={index} value={item.id}>
            {item.name}
          </Option>
        )
      }) || []

      const editCollection = async(values) => {
        setLoading(true)
        const resCollection = await editMyCollection({ id:collection.id, data: {...values} })
        setLoading(false)
        if(resCollection?.status === 200) {
          router.push(router.query.from || '/collections') 
          toast.dark('Edit collection Success!', { position: "top-right" })
        }
      }

    const onFinishFailed = (errorInfo) => {
      console.log('Failed:', errorInfo);
    };
   
    return (
            <div className={styles.collections}>
              <div className="container">
                  <h1>Edit your collection</h1>
                  <h3 className="my-5">Create, curate, and manage collections of unique NFTs to share and sell</h3>
                  
                  <Form form={form}  onFinish={editCollection} onFinishFailed={onFinishFailed}  layout='vertical' 
                  initialValues={{logo_id: collection.logo_id, cover_id: collection.cover_id, name: collection.name, description: collection.description, category_id: collection.category_id}} >
                      <Form.Item className={styles.fileContainer} name='logo_id' label="Logo image" rules={[{ required: true, message: "Please upload your logo !" }]}>
                         
                          <div className={styles.labelForFileLogo}>
                            {logoUrl && <Image src={logoUrl} alt={logoUrl} layout='fill' />}
                            <label  className={logoUrl ? styles.labelHidden : ''} htmlFor="fileLogo"><ImageIcon /></label>
                          </div>
  
                          <input type="file" id="fileLogo" accept="image/*" onChange={fileSelectLogo} />
                      </Form.Item>
  
                      <Form.Item className={styles.fileContainer} name='cover_id' label="Banner image" rules={[{ required: true, message: "Please upload your banner image !" }]}>
                         
                          <div className={styles.labelForFile}>
                            {bannerUrl && <Image src={bannerUrl} alt={bannerUrl} layout='fill' />}
                            <label  className={bannerUrl ? styles.labelHidden : ''}htmlFor="fileBanner">Drag &amp; drop file <br /> or browse media on your device</label>
                          </div>
  
                          <input type="file" id="fileBanner" accept="image/*" onChange={fileSelectBanner} />
                      </Form.Item>
  
                      <Form.Item name='name' label="Name" rules={[{ required: true, message: "Please input item name!" }]} >
                          <Input placeholder='Example: Treasure of the Sea' />
                      </Form.Item>
  
                      <Form.Item label="Description" name='description' rules={[{ required: true, message: "Please input your description" }]}>
                            <Input.TextArea rows={5} placeholder="Provide a detailed description of your collection"/>
                      </Form.Item>
  
                      <Form.Item label="Category" name='category_id' rules={[{ required: true, message: "Please choose your collection" }]}>
                          <Select placeholder='Add category'>
                            {categories}
                          </Select>
                      </Form.Item>
  
                      <Form.Item>
                          <Button htmlType="submit" loading={loading} className={styles.secondaryButton}>
                            Update 
                          </Button>
                      </Form.Item>
                  </Form>
              </div>
              <ToastContainer
                position="top-right"
              />
          </div> )
}

const mapStateToProps = (state) => ({
  isLoggedIn: state.login.isLoggedIn
})

export default connect(mapStateToProps)(EditCollection)
