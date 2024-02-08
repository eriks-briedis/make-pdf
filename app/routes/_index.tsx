import { unstable_parseMultipartFormData, type ActionFunctionArgs, unstable_createMemoryUploadHandler } from "@remix-run/node";
import { Form, useSubmit } from "@remix-run/react"
import { useEffect, useMemo, useState } from "react"
import { json } from "react-router";

export async function action({
  request,
}: ActionFunctionArgs) {
  const uploadHander = unstable_createMemoryUploadHandler({
    maxPartSize: 500_000,
  })
  const formData = await unstable_parseMultipartFormData(
    request,
    uploadHander,
  )

  const html = String(formData.get('html'));
  const filename = String(formData.get('filename')) || 'document.pdf';
  const append = formData.get('append');
  let data: Record<string, string> = {};
  const errors: Record<string, string> = {};

  try {
    data = JSON.parse(String(formData.get('data')));
  } catch (error) {
    errors.data = 'Invalid JSON';
  }

  if (!html) {
    errors.html = 'Missing HTML content';
  }

  if (Object.keys(errors).length > 0) {
    return json({ errors });
  }

  return json({ html, data });
}

export default function Index() {
  const localStorageKey = 'makepdf_'
  const submit = useSubmit()
  const fieldNames = useMemo(() => ['html', 'data', 'filename'], [])
  const [formValue, setFormValue] = useState<Record<string, string>>(fieldNames.reduce((acc, field) => ({ 
    ...acc, [field]: '',
  }), {}))
  const inputClass = 'shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:ring-blue-400 focus:border-blue-400 block w-full'

  useEffect(() => {
    fieldNames.forEach((field) => {
      const value = localStorage.getItem(`${localStorageKey}${field}`)
      if (value && value !== formValue[field]) {
        setFormValue({
          ...formValue,
          [field]: value,
        })
      }
    })
  }, [formValue, fieldNames])

  const updateFormValue = (field: string, value: string) => {
    setFormValue({
      ...formValue,
      [field]: value,
    })
    updateStorage(field, value)
  }

  const updateStorage = (field: string, value: string) => {
    try {
      localStorage.setItem(`${localStorageKey}${field}`, value)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <Form 
      className="p-5"
      method="post"
      encType="multipart/form-data"
      onSubmit={(event) => {
        submit(event.currentTarget);
      }}  
    >
      <h1 className="text-center text-2xl font-bold">MakePDF</h1>
      <label className="block mb-4">
        <span className="block text-sm font-medium text-slate-700">HTML</span>
        <textarea 
          name="html" 
          rows={10} 
          cols={50} 
          className={inputClass}
          onChange={(e) => updateFormValue('html', e.target.value)}
          value={formValue.html}
        />
      </label>

      <label className="block mb-4">
        <span className="block text-sm font-medium text-slate-700">Data</span>
        <textarea 
          name="data" 
          rows={10} 
          cols={50} 
          className={inputClass}
          onChange={(e) => updateFormValue('data', e.target.value)}
          value={formValue.data}
        />
      </label>

      <label className="block mb-4">
        <span className="block text-sm font-medium text-slate-700">Filename</span>
        <input 
          name="filename" 
          className={inputClass} 
          onChange={(e) => updateFormValue('filename', e.target.value)}
          value={formValue.filename}
        />
      </label>

      <label className="block mb-4">
        <span className="block text-sm font-medium text-slate-700">Append PDF</span>
        <input type="file" name="append" />
      </label>

      <div className="text-center">
        <button 
          className="px-4 py-2 font-semibold text-sm bg-cyan-500 text-white rounded-full shadow-sm" 
          type="submit"
        >
          Render
        </button>
      </div>
    </Form>
  )
}
