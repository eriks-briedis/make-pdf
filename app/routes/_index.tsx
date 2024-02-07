import React from "react";

export default function Index() {
  return (
    <form>
      <div>
        <label>HTML</label>
        <textarea name="html" rows={10} cols={50} />
      </div>
      <div>
        <label>Data</label>
        <textarea name="data" rows={10} cols={50} />
      </div>
      <div>
        <label>Filename</label>
        <input name="filename" />
      </div>
      <div>
        <label>Append PDF</label>
        <input type="file" name="append" />
      </div>
      <div>
        <button type="submit">Render</button>
      </div>
    </form>
  )
}
