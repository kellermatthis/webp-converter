import { Component } from '@angular/core';

@Component({
  selector: 'app-converter',
  templateUrl: './converter.component.html',
  styleUrls: ['./converter.component.css']
})
export class ConverterComponent {

  showErrorMessage: Boolean = false;
  errorMessage: string = '';
  allowedImageTypes: Array<string> = ['jpg', 'jpeg', 'png'];

  onFileSelected(event: any, p_width: number) {

    this.showErrorMessage = false;
    const uploadedFile: File = event.target.files[0];

      if (uploadedFile && this.isValidImage(uploadedFile)) {
        const formData = new FormData();
        formData.append("thumbnail", uploadedFile);
        console.log(uploadedFile);

        const wembpImage = new Image();

        wembpImage.onload = () => {
            // to keep the same aspect ratio as before
            const ratio = wembpImage.naturalWidth / wembpImage.naturalHeight;

            const canvas = document.createElement('canvas');
            canvas.width = p_width;
            canvas.height = p_width / ratio;
            canvas.getContext('2d')!.drawImage(wembpImage, 0, 0,canvas.width,canvas.height);
            canvas.toBlob((blob) => {                
                if(blob)
                    window.open(window.URL.createObjectURL(new File([blob], 'name.webp', { type: blob.type })));
            }, 'image/webp');
        };

        wembpImage.src = URL.createObjectURL(uploadedFile);
    } else {
      this.errorMessage = `Type not supported. Supported types are: ${this.allowedImageTypes.join(', ')}.`;
      this.showErrorMessage = true;
    }
  }

  isValidImage(p_file:File): Boolean {
    const typeProperties = p_file['type'].split('/');
    console.log(typeProperties);
    return typeProperties[0] === 'image' && this.allowedImageTypes.includes(typeProperties[1]);
  }

}
