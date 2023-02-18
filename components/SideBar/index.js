import React, {useState, useEffect} from 'react';
import { Collapse,  Select, Input, Button  } from 'antd';
import FilterListIcon from '@material-ui/icons/FilterList';
import styles from './style.module.scss';
import CloseIcon from '@material-ui/icons/Close';
import ether from '@/public/ether.png'
import Image from 'next/image'
import HSNLogo from '@/public/HSNLogo.png'

const {Option} = Select
const { Panel } = Collapse;

const NavBar = ({isShowSideBar, setIsShowSideBar, setPrice, setSymbol}) => {

    const callback = (key) => {
        console.log(key);
    }

    const [widthScreen, setWidthScreen] = useState()

    useEffect(() => {
        setWidthScreen(window.screen.width)
    },[])

    const [minPrice, setMinPrice] = useState('')
    const [maxPrice, setMaxPrice] = useState('')
    const [wrongPrice, setWrongPrice] = useState(false)

    const handleKeyPrice = e => {
        if(e.key === '-' || e.key === ',') {
            e.preventDefault()
        }
    }

    const setMinMax = (e, type) => {
        if(type === -1) {
            setMinPrice(e.target.value)
            if(e.target.value > maxPrice && maxPrice !== ''  && e.target.value !== '') setWrongPrice(true)
            else setWrongPrice(false)
        }   
        else {
            setMaxPrice(e.target.value);
            if(e.target.value < minPrice && minPrice !== '' && e.target.value !== '') setWrongPrice(true)
            else setWrongPrice(false)
        }

    } 

    const handleSetPrice = () => {
        setPrice(minPrice, maxPrice)
    }

    return (
        <div className={styles.sideFilter} style={{right: isShowSideBar ? '0' : (widthScreen > 768 ? '-380px' : '-100%')}}>
                <div className={styles.sideCollapse}>
                    <Collapse  expandIconPosition="right" defaultActiveKey={['1']} onChange={callback}>
                        <div className={styles.filterTitle}>
                            <div>
                                <FilterListIcon /> Filter
                            </div> 
                            <div type='button' onClick={()=>setIsShowSideBar(false)}>
                                <CloseIcon />
                            </div>
                        </div>
                        <Panel header="Price" key="1">
                            <div className={styles.filterPrice}>
                                 <Select defaultValue='' dropdownClassName={styles.chooseBlock} onChange={value => setSymbol(value)} >
                                    <Option value=''>
                                        All
                                    </Option>
                                    <Option value='ETH'>
                                        <Image width={24} height={24} objectFit='contain' src={ether} alt='ether ETH' />Ether (ETH)
                                    </Option>
                                    <Option value='BVT'>
                                        <Image width={24} height={24} objectFit='contain' src={HSNLogo} alt='HSN' />BVT
                                    </Option>
                                </Select>
                                <div className={styles.rangePrice}>
                                    <Input placeholder='Min' type="number" min="0" step="0.01" autoComplete='off' autoCorrect='off' inputMode='decimal' 
                                            onChange={e => setMinMax(e,-1)} onKeyPress={handleKeyPrice}/>

                                    <span>to</span>

                                    <Input placeholder='Max' type="number" min="0" step="0.01" autoComplete='off' autoCorrect='off' inputMode='decimal' 
                                            onChange={e => setMinMax(e, 1)} onKeyPress={handleKeyPrice} />
                                </div>
                                {wrongPrice && <p className={styles.wrongPrice}>Minimum must be less than maximum</p>}
                                <Button disabled={!wrongPrice ? false : true}  onClick={handleSetPrice} className={styles.applyPrice}>Apply</Button>
                            </div>
                        </Panel>
                    </Collapse>
        </div>
    </div>
    );
}

export default NavBar;
