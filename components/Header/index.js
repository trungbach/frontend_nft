import React, {useState, useEffect} from 'react';
import {Input } from 'antd';
import Image from 'next/image'
import {SearchOutlined  } from '@ant-design/icons'
import { Menu, Dropdown } from 'antd';
import styles from './style.module.scss'
import Wallet from '@/components/Wallet'
import Link from 'next/link'
import {useRouter} from 'next/router'
import avatarUser from '@/public/avatarUser.png'
import { ToastContainer, toast } from 'react-toastify';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { logoutAccount, toggleWallet } from '@/store/login/action'
import logo from '@/public/mainLogo.svg'
import HSNToken from '@/artifacts/contracts/HSNToken.sol/HSNToken.json'
import config from '@/config/index'
import Web3 from 'web3'
import balanceImage from '@/public/balanceHSN.png'
import Head from 'next/head'

const Header = ({isLoggedIn, user, logoutAccount, toggleWallet, type}) => {
    
    const router = useRouter()
    const [searchText, setSearchText] =  useState('')
    const [avatarUrl, setAvatarUrl] = useState()
    const [balanceHSN, setBalanceHSN] = useState()
    function collapseNav() {
        document.querySelector('#navbarNavAltMarkup').classList.remove('show')
    }

    useEffect(() => {
        collapseNav()
    },[])
    useEffect(() => {

        if (document.getElementsByClassName('collapseLink')) {
            const listCollapseLink = document.getElementsByClassName('collapseLink')
            for (var i = 0; i < listCollapseLink.length; i++) {
                listCollapseLink[i].addEventListener('click', collapseNav, false);
            }
            return function cleanup() {
                for (var i = 0; i < listCollapseLink.length; i++) {
                    listCollapseLink[i].removeEventListener('click', collapseNav, false);
                }
            };
           
        }
        
    }, []);

    useEffect(() => {
        user && setAvatarUrl(user.avatar_url)
        if(user !== undefined) {
            const getBalance = async() => {
                if (window.ethereum) {
                    web3 = new Web3(window.ethereum)
                    await window.ethereum.enable()
                    const tokenInst = new web3.eth.Contract(HSNToken.abi, config.hsnaddress);

                    const balance = await tokenInst.methods.balanceOf(user.public_address).call()
                    setBalanceHSN(balance * (10**-18)) 
                }
            }
            getBalance()
        }
    },[user])
    
    useEffect(()=> {
        if(router.pathname !== '/assets') {
            setSearchText('')
        }
    },[router.pathname])

    const onChange = (e) => {
        setSearchText(e.target.value)
    }

    const onKeyPress = e => {
        if(e.key === 'Enter') {
            e.preventDefault()
            collapseNav()
            let key = searchText.trim()
            if(router.pathname !== '/assets') {
                if(key !== '') {
                    router.push(`/assets?key=${key}`)
                   
                } else router.push('/assets')

            } else {
                if(key !== '') {
                    if(type !== '') {
                        router.push(`/assets?key=${key}&type=${type}`, undefined, {shallow: true})
                    } else router.push(`/assets?key=${key}`, undefined, {shallow: true})
                } else {
                    if(type !== '') {
                        router.push(`/assets?type=${type}`, undefined, {shallow: true})
                    } else  router.push(`/assets`, undefined, {shallow: true})
                }

            }
        }
    }


    const logOut = () => {
        logoutAccount()
        collapseNav()
        toast.dark('You have been logged out successfully!', {position: "bottom-right", autoClose: 2000 })

    }

    const menuUser = ( 
        <Menu style={{opacity: isLoggedIn ? 1 : 0}} className={styles.menuUser}>
            <Menu.Item key='0'>
                <Link href={`/account?user_id=${user?.id}`} >
                    <a  className='collapseLink'>
                        My Profile
                    </a>
                </Link>
            </Menu.Item>
            <Menu.Item key='1'>
                <Link href='/collections'>
                    <a  className='collapseLink'>
                        My Collection
                    </a>
                </Link>
            </Menu.Item>
            <Menu.Item key='2'>
                <Link href={`/account?user_id=${user?.id}&tab=favorites`}>
                    <a  className='collapseLink'>
                        My Favorites
                    </a>
                </Link>
            </Menu.Item>
            <Menu.Item key='3'>
                <Link href='/account/edit'>
                    <a  className='collapseLink'>
                        My Account Settings
                    </a>
                </Link>
            </Menu.Item>
            <Menu.Item  key='4' onClick={logOut}>
                Log Out
            </Menu.Item>
        </Menu>
    ) 

    return (  
        <>
         <Head>
            <script async src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM" crossOrigin="anonymous" />
        </Head>
        <nav className={` ${styles.nav} navbar navbar-expand-lg fixed-top navbar-dark `}>
            <div className="container">
                <Link href='/'>
                    <a className={`navbar-brand ${styles.logo}`} >
                        <div>
                            <Image width={174} height={49} src={logo} alt='logo' />
                        </div>
                    </a>
                </Link>
                
                <form className={`${styles.form} d-none d-md-flex`}>
                        <Input prefix={<SearchOutlined />} placeholder="Search items..."  value={searchText}
                        allowClear onChange={onChange} onKeyPress={onKeyPress} />
                </form>
                
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
                    <div className={`d-flex navbar-nav ${styles.navRight}`}>
                        <form className={`${styles.form} d-flex d-sm-none`}>
                                <Input prefix={<SearchOutlined />} placeholder="Search items..."  value={searchText}
                                allowClear onChange={onChange} onKeyPress={onKeyPress} />
                        </form>
                        <Link href='/assets' >
                            <a className='collapseLink'>
                                Explore
                            </a>
                        </Link>
                       
                        <Link href='/rankings'>
                            <a className='collapseLink'>Ranking</a>
                        </Link>
                        <Link href='/create'>
                            <a className='collapseLink'>Create</a>
                        </Link>
                        <div className={styles.ctaWallet}>
                            <span className={styles.balanceHSN} onClick={toggleWallet}> {isLoggedIn ?  ((balanceHSN && balanceHSN) >= 0 ? `${balanceHSN} BVT` : 'loading...') : 'Wallet'}</span>

                            <Dropdown overlay={menuUser} placement="bottomRight">
                                <a className="nav-link" href="#">
                                    {isLoggedIn ? <Image className={styles.imgAvt} objectFit='cover' width={50} height={50} src={avatarUrl || avatarUser} alt='avatar'/> :   <Image onClick={toggleWallet} width={50} height={50} quality='50' src={balanceImage} alt='balance-hsn' /> }
                                </a>
                            </Dropdown>
                        </div>
                    </div>
                </div>
            </div>
            <Wallet />
            <ToastContainer position="bottom-right"  autoClose={2000}/>
        </nav>
        </>
    );
}

const mapStateToProps = (state) => ({
    isLoggedIn: state.login.isLoggedIn,
    user: state.login.user,
    type:state.search.type
})
  
const mapDispatchToProps = (dispatch) => {
    return {
        logoutAccount: bindActionCreators(logoutAccount, dispatch),
        toggleWallet: bindActionCreators(toggleWallet, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Header)