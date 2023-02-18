import React from 'react';
import loginPage from './loginPage.module.scss';
import {Button} from 'antd'
import metamaskLogo from '@/public/metamaskLogo.svg'
import Image from 'next/image'
import {openWallet} from '@/store/login/action'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import {useRouter} from 'next/router'

const LoginPage = ({openWallet, isLoggedIn}) => {
    const router = useRouter()

    if(isLoggedIn) {
        Object.keys(router.query).length ? router.push(Object.keys(router.query)[0]) : router.push('/')
    }
    
    return (
        <div className={loginPage.login}>
            <h1>Sign in to your wallet.</h1>
            <div className={loginPage.logo}>
                <Image src={metamaskLogo} width={200} height={200} alt='metamask-logo' />
            </div>
            <Button className={loginPage.secondaryButton} onClick={()=>openWallet()}>Sign In</Button>
        </div>
    );
}

const mapStateToProps = (state) => ({
    isLoggedIn: state.login.isLoggedIn
})

const mapDispatchToProps = (dispatch) => {
    return {
        openWallet: bindActionCreators(openWallet, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginPage)
