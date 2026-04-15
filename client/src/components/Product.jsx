// 'use client'
// import { useState } from 'react'

// const API_URL =  'http://localhost:5000'

// const emptyForm = {
//   product_id: '', name: '', description: '', category: 'ring',
//   material: 'gold', purity: '', design_style: 'modern',
//   gender: 'female', price: '', weight_grams: '',
//   occasion: [], tags: '', in_stock: true,
// }

// const CATEGORIES = ['ring','necklace','earring','bracelet','pendant','bangle','chain','other']
// const MATERIALS  = ['gold','silver','platinum','rose_gold','white_gold','other']
// const STYLES     = ['traditional','modern','fusion','antique','minimalist','bridal','other']
// const OCCASIONS  = ['daily','wedding','party','festival','office','gifting']
// const GENDERS    = ['female','male','unisex']

// export default function Product() {
//   const [form, setForm] = useState(emptyForm)
//   const [imageFiles, setImageFiles] = useState([])
//   const [status, setStatus] = useState(null)
//   const [loading, setLoading] = useState(false)

//   const set = (key, val) => setForm(f => ({ ...f, [key]: val }))

//   const toggleOccasion = (occ) => {
//     set('occasion', form.occasion.includes(occ)
//       ? form.occasion.filter(o => o !== occ)
//       : [...form.occasion, occ])
//   }

//   const handleSubmit = async (e) => {
//   e.preventDefault()
//   setLoading(true)
//   setStatus(null)

//   try {
//     const fd = new FormData()
//     fd.append('product_id', form.product_id)
//     fd.append('name', form.name)
//     fd.append('description', form.description)
//     fd.append('category', form.category)
//     fd.append('material', form.material)
//     fd.append('purity', form.purity)
//     fd.append('design_style', form.design_style)
//     fd.append('gender', form.gender)
//     fd.append('price', form.price)
//     fd.append('weight_grams', form.weight_grams)
//     fd.append('in_stock', form.in_stock)
//     fd.append('occasion', JSON.stringify(form.occasion))
//     fd.append('tags', JSON.stringify(
//       form.tags.split(',').map(t => t.trim()).filter(Boolean)
//     ))

//     // Append all image files
//     imageFiles.forEach(f => fd.append('images', f))

//     const createRes = await fetch(`${API_URL}/api/products`, {
//       method: 'POST',
//       body: fd,   // no Content-Type header — browser sets it automatically for FormData
//     })

//     const created = await createRes.json()
//     if (!created.success) throw new Error(created.error)

//     setStatus({ type: 'success', msg: `Product ${created.product.product_id} created successfully!` })
//     setForm(emptyForm)
//     setImageFiles([])
//   } catch (err) {
//     setStatus({ type: 'error', msg: err.message })
//   } finally {
//     setLoading(false)
//   }
// }
//   const labelStyle = { fontSize: '0.75rem', color: '#7a5210', fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase', display: 'block', marginBottom: 6 }
//   const inputStyle = { width: '100%', padding: '8px 12px', borderRadius: 10, border: '1px solid #e8dcc8', background: '#fff', color: '#1c1a17', fontSize: '0.875rem', outline: 'none', fontFamily: "'DM Sans', sans-serif" }
//   const selectStyle = { ...inputStyle, cursor: 'pointer' }

//   return (
//     <div style={{ minHeight: '100vh', background: '#fdfaf4', fontFamily: "'DM Sans', sans-serif" }}>

//       {/* Header */}
//       <header style={{ borderBottom: '1px solid #f0e8d0', padding: '16px 24px', background: '#fff' }}>
//         <div style={{ maxWidth: 720, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
//           <div>
//             <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.5rem', fontWeight: 500, color: '#1c1a17' }}>
//               Admin Panel
//             </h1>
//             <p style={{ fontSize: '0.75rem', color: '#9a8060' }}>Add & manage jewelry products</p>
//           </div>
          
//         </div>
//       </header>

//       <main style={{ maxWidth: 720, margin: '0 auto', padding: '32px 24px' }}>
//         <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

//           {/* Row: ID + Name */}
//           <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 16 }}>
//             <div>
//               <label style={labelStyle}>Product ID *</label>
//               <input style={inputStyle} placeholder="JWL-006" value={form.product_id}
//                 onChange={e => set('product_id', e.target.value)} required />
//             </div>
//             <div>
//               <label style={labelStyle}>Product Name *</label>
//               <input style={inputStyle} placeholder="Gold Kundan Ring" value={form.name}
//                 onChange={e => set('name', e.target.value)} required />
//             </div>
//           </div>

//           {/* Description */}
//           <div>
//             <label style={labelStyle}>Description *</label>
//             <textarea style={{ ...inputStyle, resize: 'vertical', minHeight: 80 }}
//               placeholder="Detailed description of the product..." value={form.description}
//               onChange={e => set('description', e.target.value)} required />
//           </div>

//           {/* Row: Category, Material, Style */}
//           <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
//             <div>
//               <label style={labelStyle}>Category *</label>
//               <select style={selectStyle} value={form.category} onChange={e => set('category', e.target.value)}>
//                 {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
//               </select>
//             </div>
//             <div>
//               <label style={labelStyle}>Material *</label>
//               <select style={selectStyle} value={form.material} onChange={e => set('material', e.target.value)}>
//                 {MATERIALS.map(m => <option key={m} value={m}>{m.replace('_', ' ')}</option>)}
//               </select>
//             </div>
//             <div>
//               <label style={labelStyle}>Design Style</label>
//               <select style={selectStyle} value={form.design_style} onChange={e => set('design_style', e.target.value)}>
//                 {STYLES.map(s => <option key={s} value={s}>{s}</option>)}
//               </select>
//             </div>
//           </div>

//           {/* Row: Price, Weight, Purity, Gender */}
//           <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
//             <div>
//               <label style={labelStyle}>Price (₹) *</label>
//               <input style={inputStyle} type="number" placeholder="5000" value={form.price}
//                 onChange={e => set('price', e.target.value)} required />
//             </div>
//             <div>
//               <label style={labelStyle}>Weight (g)</label>
//               <input style={inputStyle} type="number" step="0.1" placeholder="12.5" value={form.weight_grams}
//                 onChange={e => set('weight_grams', e.target.value)} />
//             </div>
//             <div>
//               <label style={labelStyle}>Purity</label>
//               <input style={inputStyle} placeholder="22kt / 925" value={form.purity}
//                 onChange={e => set('purity', e.target.value)} />
//             </div>
//             <div>
//               <label style={labelStyle}>Gender</label>
//               <select style={selectStyle} value={form.gender} onChange={e => set('gender', e.target.value)}>
//                 {GENDERS.map(g => <option key={g} value={g}>{g}</option>)}
//               </select>
//             </div>
//           </div>

//           {/* Occasions */}
//           <div>
//             <label style={labelStyle}>Occasions</label>
//             <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
//               {OCCASIONS.map(occ => (
//                 <button type="button" key={occ}
//                   onClick={() => toggleOccasion(occ)}
//                   style={{
//                     padding: '5px 14px', borderRadius: 20, fontSize: '0.8rem', cursor: 'pointer',
//                     border: form.occasion.includes(occ) ? '1.5px solid #d4a843' : '1px solid #e8dcc8',
//                     background: form.occasion.includes(occ) ? '#faf3e0' : '#fff',
//                     color: form.occasion.includes(occ) ? '#7a5210' : '#9a8060',
//                   }}
//                 >
//                   {occ}
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* Tags */}
//           <div>
//             <label style={labelStyle}>Tags (comma separated)</label>
//             <input style={inputStyle} placeholder="kundan, bridal, heavy, traditional"
//               value={form.tags} onChange={e => set('tags', e.target.value)} />
//           </div>

//           {/* Images */}
//           <div>
//             <label style={labelStyle}>Product Images</label>
//             <div
//               style={{
//                 border: '2px dashed #e8dcc8', borderRadius: 12, padding: '24px',
//                 textAlign: 'center', background: '#fdfaf4', cursor: 'pointer',
//               }}
//               onClick={() => document.getElementById('img-input').click()}
//             >
//               <input id="img-input" type="file" accept="image/*" multiple hidden
//                 onChange={e => setImageFiles(Array.from(e.target.files))} />
//               <p style={{ color: '#9a8060', fontSize: '0.875rem' }}>
//                 {imageFiles.length > 0
//                   ? `${imageFiles.length} image(s) selected: ${imageFiles.map(f => f.name).join(', ')}`
//                   : 'Click to select images (first image = primary)'}
//               </p>
//             </div>
//           </div>

//           {/* In Stock */}
//           <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
//             <input type="checkbox" checked={form.in_stock} onChange={e => set('in_stock', e.target.checked)}
//               style={{ width: 16, height: 16, accentColor: '#d4a843' }} />
//             <span style={{ fontSize: '0.875rem', color: '#1c1a17' }}>In stock</span>
//           </label>

//           {/* Status */}
//           {status && (
//             <div style={{
//               padding: '12px 16px', borderRadius: 10, fontSize: '0.875rem',
//               background: status.type === 'success' ? '#f0fdf4' : '#fef2f2',
//               color: status.type === 'success' ? '#15803d' : '#991b1b',
//               border: `1px solid ${status.type === 'success' ? '#bbf7d0' : '#fecaca'}`,
//             }}>
//               {status.msg}
//             </div>
//           )}

//           {/* Submit */}
//           <button
//             type="submit"
//             disabled={loading}
//             style={{
//               padding: '12px 28px', borderRadius: 12, border: 'none',
//               background: loading ? '#e8dcc8' : '#1c1a17',
//               color: loading ? '#b0a090' : '#fdfaf4',
//               fontSize: '0.9rem', fontWeight: 500, cursor: loading ? 'not-allowed' : 'pointer',
//               fontFamily: "'DM Sans', sans-serif", letterSpacing: '0.03em',
//             }}
//           >
//             {loading ? 'Creating product…' : 'Add product to catalog'}
//           </button>
//         </form>
//       </main>
//     </div>
//   )
// }

'use client'
import { useState } from 'react'

const API_URL = 'http://localhost:5000'

const emptyForm = {
  product_id: '', name: '', description: '', category: 'ring',
  material: 'gold', purity: '', design_style: 'modern',
  gender: 'female', price: '', weight_grams: '',
  occasion: [], tags: '', in_stock: true,
}

const CATEGORIES = ['ring','necklace','earring','bracelet','pendant','bangle','chain','other']
const MATERIALS  = ['gold','silver','platinum','rose_gold','white_gold','other']
const STYLES     = ['traditional','modern','fusion','antique','minimalist','bridal','other']
const OCCASIONS  = ['daily','wedding','party','festival','office','gifting']
const GENDERS    = ['female','male','unisex']

export default function Product() {
  const [form, setForm] = useState(emptyForm)
  const [imageFiles, setImageFiles] = useState([])
  const [status, setStatus] = useState(null)
  const [loading, setLoading] = useState(false)

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }))

  const toggleOccasion = (occ) => {
    set('occasion', form.occasion.includes(occ)
      ? form.occasion.filter(o => o !== occ)
      : [...form.occasion, occ])
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setStatus(null)
    try {
      const fd = new FormData()
      fd.append('product_id', form.product_id)
      fd.append('name', form.name)
      fd.append('description', form.description)
      fd.append('category', form.category)
      fd.append('material', form.material)
      fd.append('purity', form.purity)
      fd.append('design_style', form.design_style)
      fd.append('gender', form.gender)
      fd.append('price', form.price)
      fd.append('weight_grams', form.weight_grams)
      fd.append('in_stock', form.in_stock)
      fd.append('occasion', JSON.stringify(form.occasion))
      fd.append('tags', JSON.stringify(
        form.tags.split(',').map(t => t.trim()).filter(Boolean)
      ))
      imageFiles.forEach(f => fd.append('images', f))
      const createRes = await fetch(`${API_URL}/api/products`, {
        method: 'POST',
        body: fd,
      })
      const created = await createRes.json()
      if (!created.success) throw new Error(created.error)
      setStatus({ type: 'success', msg: `Product ${created.product.product_id} created successfully!` })
      setForm(emptyForm)
      setImageFiles([])
    } catch (err) {
      setStatus({ type: 'error', msg: err.message })
    } finally {
      setLoading(false)
    }
  }

  const labelStyle = {
    fontSize: '0.72rem', color: '#7a3050', fontWeight: 600,
    letterSpacing: '0.08em', textTransform: 'uppercase', display: 'block', marginBottom: 6,
  }
  const inputStyle = {
    width: '100%', padding: '8px 12px', borderRadius: 10,
    border: '1px solid rgba(210,120,150,0.35)',
    background: 'rgba(255,255,255,0.55)',
    backdropFilter: 'blur(8px)',
    color: '#1a1a1a', fontSize: '0.875rem', outline: 'none',
    fontFamily: "'DM Sans', sans-serif",
    boxSizing: 'border-box',
  }
  const selectStyle = {
    ...inputStyle,
    cursor: 'pointer',
    color: '#1a1a1a',
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f7cfe0 0%, #fae0ec 50%, #f5c8db 100%)',
      fontFamily: "'DM Sans', sans-serif",
    }}>

      <style>{`
        select option {
          background: #fff0f5;
          color: #1a1a1a;
        }
        input::placeholder, textarea::placeholder {
          color: #b07090;
        }
      `}</style>

      {/* Header */}
      <header style={{
        borderBottom: '1px solid rgba(210,120,150,0.25)',
        padding: '16px 24px',
        background: 'rgba(255,255,255,0.25)',
        backdropFilter: 'blur(16px)',
      }}>
        <div style={{ maxWidth: 720, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.5rem', fontWeight: 500, color: '#5a1a30' }}>
              Admin Panel
            </h1>
            <p style={{ fontSize: '0.75rem', color: '#a05070' }}>Add & manage jewelry products</p>
          </div>
        </div>
      </header>

      <main style={{ maxWidth: 720, margin: '0 auto', padding: '32px 24px' }}>

        {/* Glass card wrapper */}
        <div style={{
          background: 'rgba(255,255,255,0.28)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(210,120,150,0.3)',
          borderRadius: 20,
          padding: '32px 28px',
        }}>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* Row: ID + Name */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 16 }}>
              <div>
                <label style={labelStyle}>Product ID *</label>
                <input style={inputStyle} placeholder="JWL-006" value={form.product_id}
                  onChange={e => set('product_id', e.target.value)} required />
              </div>
              <div>
                <label style={labelStyle}>Product Name *</label>
                <input style={inputStyle} placeholder="Gold Kundan Ring" value={form.name}
                  onChange={e => set('name', e.target.value)} required />
              </div>
            </div>

            {/* Description */}
            <div>
              <label style={labelStyle}>Description *</label>
              <textarea style={{ ...inputStyle, resize: 'vertical', minHeight: 80 }}
                placeholder="Detailed description of the product..." value={form.description}
                onChange={e => set('description', e.target.value)} required />
            </div>

            {/* Row: Category, Material, Style */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
              <div>
                <label style={labelStyle}>Category *</label>
                <select style={selectStyle} value={form.category} onChange={e => set('category', e.target.value)}>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Material *</label>
                <select style={selectStyle} value={form.material} onChange={e => set('material', e.target.value)}>
                  {MATERIALS.map(m => <option key={m} value={m}>{m.replace('_', ' ')}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Design Style</label>
                <select style={selectStyle} value={form.design_style} onChange={e => set('design_style', e.target.value)}>
                  {STYLES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>

            {/* Row: Price, Weight, Purity, Gender */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
              <div>
                <label style={labelStyle}>Price (₹) *</label>
                <input style={inputStyle} type="number" placeholder="5000" value={form.price}
                  onChange={e => set('price', e.target.value)} required />
              </div>
              <div>
                <label style={labelStyle}>Weight (g)</label>
                <input style={inputStyle} type="number" step="0.1" placeholder="12.5" value={form.weight_grams}
                  onChange={e => set('weight_grams', e.target.value)} />
              </div>
              <div>
                <label style={labelStyle}>Purity</label>
                <input style={inputStyle} placeholder="22kt / 925" value={form.purity}
                  onChange={e => set('purity', e.target.value)} />
              </div>
              <div>
                <label style={labelStyle}>Gender</label>
                <select style={selectStyle} value={form.gender} onChange={e => set('gender', e.target.value)}>
                  {GENDERS.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>
            </div>

            {/* Occasions */}
            <div>
              <label style={labelStyle}>Occasions</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {OCCASIONS.map(occ => (
                  <button type="button" key={occ}
                    onClick={() => toggleOccasion(occ)}
                    style={{
                      padding: '5px 14px', borderRadius: 20, fontSize: '0.8rem', cursor: 'pointer',
                      border: form.occasion.includes(occ) ? '1.5px solid #c0607a' : '1px solid rgba(210,120,150,0.4)',
                      background: form.occasion.includes(occ) ? 'rgba(239,141,180,0.35)' : 'rgba(255,255,255,0.4)',
                      color: form.occasion.includes(occ) ? '#5a1a30' : '#9a5068',
                      backdropFilter: 'blur(8px)',
                      fontWeight: form.occasion.includes(occ) ? 600 : 400,
                    }}
                  >
                    {occ}
                  </button>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div>
              <label style={labelStyle}>Tags (comma separated)</label>
              <input style={inputStyle} placeholder="kundan, bridal, heavy, traditional"
                value={form.tags} onChange={e => set('tags', e.target.value)} />
            </div>

            {/* Images */}
            <div>
              <label style={labelStyle}>Product Images</label>
              <div
                style={{
                  border: '2px dashed rgba(210,120,150,0.5)', borderRadius: 12, padding: '24px',
                  textAlign: 'center',
                  background: 'rgba(255,255,255,0.3)',
                  backdropFilter: 'blur(8px)',
                  cursor: 'pointer',
                }}
                onClick={() => document.getElementById('img-input').click()}
              >
                <input id="img-input" type="file" accept="image/*" multiple hidden
                  onChange={e => setImageFiles(Array.from(e.target.files))} />
                <p style={{ color: '#9a5068', fontSize: '0.875rem', margin: 0 }}>
                  {imageFiles.length > 0
                    ? `${imageFiles.length} image(s) selected: ${imageFiles.map(f => f.name).join(', ')}`
                    : 'Click to select images (first image = primary)'}
                </p>
              </div>
            </div>

            {/* In Stock */}
            <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
              <input type="checkbox" checked={form.in_stock} onChange={e => set('in_stock', e.target.checked)}
                style={{ width: 16, height: 16, accentColor: '#ef8db4' }} />
              <span style={{ fontSize: '0.875rem', color: '#1a1a1a' }}>In stock</span>
            </label>

            {/* Status */}
            {status && (
              <div style={{
                padding: '12px 16px', borderRadius: 10, fontSize: '0.875rem',
                background: status.type === 'success' ? 'rgba(200,255,220,0.5)' : 'rgba(255,200,200,0.5)',
                color: status.type === 'success' ? '#155a2a' : '#7a1a1a',
                border: `1px solid ${status.type === 'success' ? 'rgba(100,200,130,0.5)' : 'rgba(220,100,100,0.4)'}`,
                backdropFilter: 'blur(8px)',
              }}>
                {status.msg}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: '12px 28px', borderRadius: 12,
                border: '1px solid rgba(180,80,110,0.4)',
                background: loading ? 'rgba(239,141,180,0.2)' : 'rgba(239,141,180,0.5)',
                backdropFilter: 'blur(12px)',
                color: loading ? '#b07090' : '#3a0a1a',
                fontSize: '0.9rem', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer',
                fontFamily: "'DM Sans', sans-serif", letterSpacing: '0.03em',
                transition: 'background 0.2s',
              }}
            >
              {loading ? 'Creating product…' : 'Add product to catalog'}
            </button>

          </form>
        </div>
      </main>
    </div>
  )
}