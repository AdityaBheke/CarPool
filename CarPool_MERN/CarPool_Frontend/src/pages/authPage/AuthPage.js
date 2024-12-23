import { useCallback, useEffect, useState } from 'react';
import styles from './authPage.module.css';
import { useNavigate } from 'react-router-dom';

export default function AuthPage({type}) {
    const [buttonText, setButtonText] = useState('');
    const [reg, setReg] = useState(true);
    const navigate = useNavigate();

    useEffect(()=>{
        if (type==='signup') {
            setReg(true)
            setButtonText('Sign Up');
        } else {
            setReg(false)
            setButtonText('Sign In');
        }
    },[type])

    const handleOnSubmit = useCallback((e)=>{
        e.preventDefault();
        if (reg) {
            navigate('/signin')
        } else {
            navigate('/')
        }
    },[navigate, reg])

    const handleCancel = useCallback((e)=>{
        navigate('/welcome');
    },[navigate]);

    return <div className={styles.main}>
        <div className={styles.pageHead}>{buttonText}</div>
        <form onSubmit={handleOnSubmit} className={styles.form}>
            {reg && <div className={styles.formItem}>
                <label htmlFor='name' className={styles.formLabel}>Name</label>
                <input type='text' id='name' placeholder='Enter name' className={styles.formInput}/>
            </div>}
            <div className={styles.formItem}>
                <label htmlFor='email' className={styles.formLabel}>Email</label>
                <input type='email' id='email' placeholder='Enter email' className={styles.formInput}/>
            </div>
            <div className={styles.formItem}>
                <label htmlFor='password' className={styles.formLabel}>Password</label>
                <input type='password' id='password' placeholder='Create password' className={styles.formInput}/>
            </div>
            {reg && <div className={styles.formItem}>
                <label htmlFor='mbile' className={styles.formLabel}>Mobile</label>
                <input type='tel' id='mobile' placeholder='Enter mobile' className={styles.formInput}/>
            </div>}
            {reg && <div className={styles.formItem}>
                <label htmlFor='gender' className={styles.formLabel}>Gender</label>
                <select id='gender' defaultValue={'default'} className={styles.formInput}>
                    <option value={'default'} disabled>Select gender</option>
                    <option value={'male'}>Male</option>
                    <option value={'female'}>Female</option>
                </select>
            </div>}
            <div className={styles.buttonContainer}>
                <button type='submit' className={`${styles.button} ${styles.submitButton}`}>{buttonText}</button>
                <button className={styles.button} onClick={handleCancel}>Cancel</button>
                <div>Already registered? sign in here.</div>
            </div>
        </form>
    </div>
}