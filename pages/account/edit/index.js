import React, {useState, useEffect} from 'react';
import styles from './style.module.scss'
import { Button, Form, Input } from 'antd'
import Image from 'next/image'
import { ToastContainer, toast } from 'react-toastify';
import dynamic from 'next/dynamic'
import config from '@/config/index'
import superagent from 'superagent'
import ImageIcon from '@material-ui/icons/Image';
import {updateProfile} from '@/pages/api/user'
import {useRouter} from 'next/router'
import { connect } from 'react-redux'
import {getProfileById} from '@/pages/api/user'
import { editProfile } from '@/store/login/action'
import { bindActionCreators } from 'redux'

const Footer = dynamic(() => import('@/components/Footer'))
const EditAccount = ({user, isLoggedIn, editProfile}) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false)
    const [avatarUrl, setAvatarUrl] = useState()
    const [coverUrl, setCoverUrl] = useState()
    const router = useRouter()

    useEffect(() => {
        if(!isLoggedIn) {
           router.push('/login')
      }
      },[isLoggedIn])

      useEffect(() => {
        user && setAvatarUrl(user.avatar_url)
    },[user])

    useEffect(() => {
        user && setCoverUrl(user.cover_url)
    },[user])

    const fileSelectLogo = async (e) => {
        var file = e.target.files[0];
        if (file) {
            superagent
                .post(config.NEXT_PUBLIC_API_DOMAIN + '/upload-file')
                .attach('file', file)
                .end((err, res) => {
                    if (!err) {
                        form.setFieldsValue({avatar_id: res.body.data.id})
                        setAvatarUrl(res.body.data.original_url)
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
                        setCoverUrl(res.body.data.original_url)
                    }
                });
        }
    }


    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    const onFinish = async(values) => {
       const resUpdate = await updateProfile(values);
       if(resUpdate.status === 200) {
            const infoById = await getProfileById({id: user.id})
            editProfile(infoById)
            toast.success('Update profile success', { autoClose: 2000, position: 'top-right'})
            router.push(`/account?user_id=${user?.id}`)
       }
    };

    return (
        <>
        <div className={styles.editAccount}>
            <div className="container">
                <h1>General Settings</h1>
                <Form form={form}  onFinish={onFinish} onFinishFailed={onFinishFailed}  layout='vertical' 
                 initialValues={{avatar_id: user?.avatar_id, cover_id: user?.cover_id, username: user?.username, description: user?.description, email: user?.email}} >
                      <Form.Item className={styles.fileContainer} name='avatar_id' label="Avatar image" rules={[{ required: true, message: "Please upload your avatar !" }]}>
                         
                          <div className={styles.labelForFileLogo}>
                            { avatarUrl ? (<><Image src={avatarUrl} alt={avatarUrl} layout='fill' />
                            <label  className={styles.labelHidden} htmlFor="fileLogo"><ImageIcon /></label></>)
                            :   <label htmlFor="fileLogo"><ImageIcon /></label>
                            }
                          </div>
  
                          <input type="file" id="fileLogo" accept="image/*" onChange={fileSelectLogo} />
                      </Form.Item>
  
                      <Form.Item className={styles.fileContainer} name='cover_id' label="Cover image" rules={[{ required: true, message: "Please upload your banner image !" }]}>
                         
                          <div className={styles.labelForFile}>
                            { coverUrl && <Image src={coverUrl} alt={coverUrl} layout='fill' />}
                            <label  className={coverUrl ? styles.labelHidden : ''}htmlFor="fileBanner">Drag &amp; drop file <br /> or browse media on your device</label>
                          </div>
  
                          <input type="file" id="fileBanner" accept="image/*" onChange={fileSelectBanner} />
                      </Form.Item>
  
                      <Form.Item name='username' label="Username" rules={[{ required: true, message: "Please input username!" }]} >
                          <Input placeholder='Username' />
                      </Form.Item>
  
                      <Form.Item label="Bio" name='description' >
                            <Input.TextArea rows={5} placeholder="Tell the world your story!"/>
                      </Form.Item>
  
                      <Form.Item label="Email" name='email' rules={[{ type: 'email' }]}>
                            <Input type='email' placeholder="Enter your email"/>
                      </Form.Item>

                      <Form.Item>
                          <Button htmlType="submit" loading={loading} className={styles.secondaryButton}>
                            Save 
                          </Button>
                      </Form.Item>
                  </Form>
              
                  <ToastContainer
                    autoClose={2000}
                    position='top-right'
                    />
            </div>
        </div>
        <Footer />
        </>
    );
}

const mapStateToProps = (state) => ({
    user: state.login.user,
    isLoggedIn: state.login.isLoggedIn
})

const mapDispatchToProps = (dispatch) => {
    return {
        editProfile: bindActionCreators(editProfile, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditAccount)
