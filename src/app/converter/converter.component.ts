import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-converter',
  templateUrl: './converter.component.html',
  styleUrls: ['./converter.component.css']
})
export class ConverterComponent {
  
  constructor(private toastr: ToastrService) {}

  allowedImageTypes: Array<string> = ['jpg', 'jpeg', 'png'];
  widths: number[] = [ 2560, 1920, 1280 ];
  selectedWidth: number = 1920;
  
  onFileSelected(event: any) {

    const uploadedFile: File = event.target.files[0];

      if (uploadedFile && this.isValidImage(uploadedFile)) {
        const formData = new FormData();
        formData.append("thumbnail", uploadedFile);

        const wembpImage = new Image();

        wembpImage.onload = () => {
            // to keep the same aspect ratio as before
            const ratio = wembpImage.naturalWidth / wembpImage.naturalHeight;

            const canvas = document.createElement('canvas');
            canvas.width = this.selectedWidth;
            canvas.height = this.selectedWidth / ratio;
            canvas.getContext('2d')!.drawImage(wembpImage, 0, 0,canvas.width,canvas.height);
            canvas.toBlob((blob) => {                
                if(blob)
                    window.open(window.URL.createObjectURL(new File([blob], 'name.webp', { type: blob.type })));
            }, 'image/webp');
        };

        wembpImage.src = URL.createObjectURL(uploadedFile);
    } else {
      this.toastr.error(`Type not supported. Supported types are: ${this.allowedImageTypes.join(', ')}.`);
    }
  }

  isValidImage(p_file:File): Boolean {
    const typeProperties = p_file['type'].split('/');
    return typeProperties[0] === 'image' && this.allowedImageTypes.includes(typeProperties[1]);
  }

}
