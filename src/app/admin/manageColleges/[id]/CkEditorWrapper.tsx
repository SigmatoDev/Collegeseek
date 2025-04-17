// 'use client';

// import { CKEditor } from '@ckeditor/ckeditor5-react';
// import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
// import Base64UploadAdapter from '@ckeditor/ckeditor5-upload/src/adapters/base64uploadadapter';

// type Props = {
//   value: string;
//   onChange: (value: string) => void;
// };

// class CustomBase64UploadAdapter {
//   private adapter: any;

//   constructor(loader: any) {
//     this.adapter = new Base64UploadAdapter(loader);
//   }

//   upload() {
//     return this.adapter.upload();
//   }

//   abort() {
//     return this.adapter.abort?.();
//   }
// }

// export default function CkEditorWrapper({ value, onChange }: Props) {
//   return (
//     <div className="w-full">
//       <CKEditor
//         editor={ClassicEditor as any} // 👈 bypass typing issue
//         data={value}
//         onReady={(editor) => {
//           editor.plugins.get('FileRepository').createUploadAdapter = (loader: any) => {
//             return new CustomBase64UploadAdapter(loader);
//           };
//         }}
//         onChange={(_, editor) => {
//           const data = editor.getData();
//           onChange(data);
//         }}
//         config={{
//           toolbar: [
//             'heading',
//             '|',
//             'bold',
//             'italic',
//             'underline',
//             'bulletedList',
//             'numberedList',
//             'link',
//             '|',
//             'blockQuote',
//             'insertTable',
//             'undo',
//             'redo',
//             'imageUpload',
//           ],
//           image: {
//             toolbar: ['imageTextAlternative', 'imageStyle:full', 'imageStyle:side'],
//           },
//         }}
//       />
//     </div>
//   );
// }
  