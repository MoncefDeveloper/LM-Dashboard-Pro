import React, { useState } from "react";
import img from './../../assets/images/undraw_profile_pic_ic-5-t.svg';
import { BiError } from 'react-icons/bi'
import { useForm } from "react-hook-form";


const AddAdminForm = ({ handleData }) => {
  const { register, setValue, handleSubmit, formState: { errors } } = useForm({
    shouldFocusError: true,
  });
  const [newImg, setNewImg] = useState(img);

  // showing img 
  const handleImg = (e) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
        setNewImg(reader.result);
      }
    }
    e.target.files[0] ? reader.readAsDataURL(e.target.files[0]) : setNewImg(img);
  }

  
  return (
    <form onSubmit={handleSubmit(handleData)}>
      <div className="left">

        {/* Front-Img */}
        <div className="img-box">
          <label htmlFor="admin_img">
            <div className="img img-profile"><img src={newImg} alt="img" /></div>
          </label>
          <input
            type='file'
            id="admin_img"
            onChange={(e) => { setValue('admin_img', e.target.value.files) }}
            {...register('admin_img', {
              onChange: handleImg,
              required: true,
              validate: value =>
                value[0].size / 1024 < 1000 || "Size must Be at the most 1 Mo"
            })}
          />
          <div className="role">JPG or PNG no larger than 1 MB</div>
          {( errors?.admin_img?.type === 'required') && (
            <div className="validate"><div className="sym"><BiError /></div> This is Required</div>
          )}
          { errors?.admin_img?.type === 'validate' && (
            <div className="validate"><div className="sym"><BiError /></div> Size must Be at the most 1 Mo</div>
          )}
        </div>
      </div>
      <div className="right">

        {/* name */}
        <div className="input-box">
          <div className="input-title">Admin name:</div>
          <input type="text" placeholder="Username" {...register('name', { required: true, minLength: 3 })} />
          {(errors?.name?.type === 'required') && (
            <div className="validate"><div className="sym"><BiError /></div> This is Required</div>
          )}
          {(errors?.name?.type === 'minLength') && (
            <div className="validate"><div className="sym"><BiError /></div>Min Length Should Be 3</div>
          )}
        </div>
        
        {/* email */}
        <div className="input-box">
          <div className="input-title">Email:</div>
          <input type="email" placeholder="name@exemple.com" {...register('email', { required: true })} />
          {(errors?.email?.type === 'required') && (
            <div className="validate"><div className="sym"><BiError /></div> This is Required</div>
          )}
        </div>
        
        {/* phone */}
        <div className="input-box">
          <div className="input-title">Phone:</div>
          <input type="number" placeholder="555-123-456" {...register('phone', { required: true,valueAsNumber:true })} />
          {( errors?.phone?.type === 'required') && (
            <div className="validate"><div className="sym"><BiError /></div> This is Required</div>
          )}
        </div>        
        
        {/* password */}
        <div className="input-box">
          <div className="input-title">Password:</div>
          <input type="password" {...register('password', { required: true,minLength:6 })} />
          {( errors?.password?.type === 'required') && (
            <div className="validate"><div className="sym"><BiError /></div> This is Required</div>
          )}
          {(errors?.password?.type === 'minLength') && (
            <div className="validate"><div className="sym"><BiError /></div>Min Length Should Be 6</div>
          )}
        </div>        
        
        <button className="btn-prem">Add Admin</button>
      </div>
    </form>
  );
}

export default AddAdminForm;
