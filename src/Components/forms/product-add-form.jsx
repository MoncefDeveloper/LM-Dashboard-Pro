import React, { useState } from "react";
import img from './../../assets/images/undraw_photos_re_pvh3.svg';
import backImg from './../../assets/images/undraw_photos_re_pvh3.svg';
import { BiError } from 'react-icons/bi'
import { useForm } from "react-hook-form";


const AddProductForm = ({ handleData, categories }) => {
  const { register, setValue, handleSubmit, formState: { errors } } = useForm({
    shouldFocusError: true,
  });
  const [newImg, setNewImg] = useState(img);
  const [newBackImg, setNewBackImg] = useState(backImg);
  const roles = [
    'Simple',
    'Menu',
    'First_page',
    'More',
  ];

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

  // showing back img 
  const handleBackImg = (e) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
        setNewBackImg(reader.result);
      }
    }
    e.target.files[0] ? reader.readAsDataURL(e.target.files[0]) : setNewBackImg(backImg);
  }
  return (
    <form onSubmit={handleSubmit(handleData)}>
      <div className="left">

        {/* Front-Img */}
        <div className="img-box">
          <label htmlFor="product_img">
            <div className="img"><img src={newImg} alt="img" /></div>
          </label>
          <input
            type='file'
            id="product_img"
            onChange={(e) => { setValue('product_img', e.target.value.files) }}
            {...register('product_img', {
              onChange: handleImg,
              required: true,
              validate: value =>
                value[0].size / 1024 < 1000 || "Size must Be at the most 1 Mo"
            })}
          />
          <div className="role">JPG or PNG no larger than 1 MB</div>
          {(errors.product_img && errors.product_img.type === 'required') && (
            <div className="validate"><div className="sym"><BiError /></div> This is Required</div>
          )}
          {errors.product_img && errors.product_img.type === 'validate' && (
            <div className="validate"><div className="sym"><BiError /></div> Size must Be at the most 1 Mo</div>
          )}
        </div>

        {/* Back-Img */}
        <div className="img-box">
          <label htmlFor="product_img_back">
            <div className="img"><img src={newBackImg} alt="img" /></div>
          </label>
          <input
            type='file'
            id="product_img_back"
            onChange={(e) => { setValue('product_img_back', e.target.value.files) }}
            {...register('product_img_back', {
              onChange: handleBackImg,
              required: true,
              validate: value =>
                value[0].size / 1024 < 1000 || "Size must Be at the most 1 Mo"
            })}
          />
          <div className="role">JPG or PNG no larger than 1 MB</div>
          {(errors.product_img_back && errors.product_img_back.type === 'required') && (
            <div className="validate"><div className="sym"><BiError /></div> This is Required</div>
          )}
          {errors.product_img_back && errors.product_img_back.type === 'validate' && (
            <div className="validate"><div className="sym"><BiError /></div> Size must Be at the most 1 Mo</div>
          )}
        </div>
      </div>
      <div className="right">

        {/* name */}
        <div className="input-box">
          <div className="input-title">Product name:</div>
          <input type="text" placeholder="Exemple" {...register('name', { required: true, minLength: 3 })} />
          {(errors.name && errors.name.type === 'required') && (
            <div className="validate"><div className="sym"><BiError /></div> This is Required</div>
          )}
          {(errors.name && errors.name.type === 'minLength') && (
            <div className="validate"><div className="sym"><BiError /></div>Min Length Should Be 3</div>
          )}
        </div>

        {/* price */}
        <div className="input-box">
          <div className="input-title">Price:</div>
          <input type="number" placeholder="2200" {...register('price', { required: true })} />
          {(errors.price && errors.price.type === 'required') && (
            <div className="validate"><div className="sym"><BiError /></div> This is Required</div>
          )}

          {/*  Description  */}
        </div>
        <div className="input-box">
          <div className="input-title">Description:</div>
          <textarea
            placeholder="Exemple is exemple"
            rows="10"
            {...register('description', { required: true, minLength: 10 })}
          />
          {(errors.description && errors.description.type === 'required') && (
            <div className="validate"><div className="sym"><BiError /></div> This is Required</div>
          )}
          {(errors.description && errors.description.type === 'minLength') && (
            <div className="validate"><div className="sym"><BiError /></div>Min Length Should Be 10</div>
          )}
        </div>

        {/* Details */}
        <div className="input-box">
          <div className="input-title">Details:</div>
          <textarea
            placeholder="Exemple is exemple"
            rows={10}
            {...register('details', { required: true, minLength: 10 })}
          />
          {(errors.details && errors.details.type === 'required') && (
            <div className="validate"><div className="sym"><BiError /></div> This is Required</div>
          )}
          {(errors.details && errors.details.type === 'minLength') && (
            <div className="validate"><div className="sym"><BiError /></div>Min Length Should Be 10</div>
          )}
        </div>

        {/* Category */}
        <div className="input-box">
          <div className="input-title">Category name:</div>
          <select
            onFocus={e => { e.target[0].disabled = true; e.target[0].hidden = true }}
            {...register('category', { required: true })}
          >
            <option value="">Select Category</option>
            {categories?.map((category, key) => {
              return <option key={key} value={category.id}>{category.name}</option>
            })}

          </select >
          {(errors.category && errors.category.type === 'required') && (
            <div className="validate"><div className="sym"><BiError /></div> This is Required</div>
          )}
        </div>

        {/* Role */}
        <div className="input-box">
          <div className="input-title">Role:</div>
          <select
            onFocus={e => { e.target[0].disabled = true; e.target[0].hidden = true }}
            {...register('role', { required: true })}
          >
            <option value="">Select Role</option>
            {roles?.map((role, key) => {
              return <option key={key} value={role}>{role}</option>
            })}

          </select >
          {(errors.role && errors.role.type === 'required') && (
            <div className="validate"><div className="sym"><BiError /></div> This is Required</div>
          )}
        </div>

        {/* Trend */}
        <div className="input-box">
          <div className="input-radio">
            <div className="input-title">Trend:</div>
            <input type='radio' defaultChecked value='0' {...register('trend', { required: true })} /> No
            <input type='radio' value='1' {...register('trend', { required: true })} /> Yes
          </div>
        </div>

        {/* Active */}
        <div className="input-box">
          <div className="input-radio">
            <div className="input-title">Active:</div>
            <input type='radio' defaultChecked value='0' {...register('active', { required: true })} /> No
            <input type='radio' value='1' {...register('active', { required: true })} /> Yes
          </div>
        </div>
        <button className="btn-prem">Add Product</button>
      </div>
    </form>
  );
}

export default AddProductForm;
