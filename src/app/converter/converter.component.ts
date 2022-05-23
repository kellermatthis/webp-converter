import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { saveAs } from 'file-saver';
import * as FileSaver from 'file-saver';

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
  uploadedFile: File | undefined = undefined;
  fileSelected = false;
  
  onFileSelected(event: any) {
    this.uploadedFile = event.target.files[0];   
    this.fileSelected = true;   
  }

  convertFile(){
    if (this.uploadedFile && this.isValidImage(this.uploadedFile)) {
      const formData = new FormData();
      formData.append("thumbnail", this.uploadedFile);

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
                FileSaver.saveAs(blob, this.uploadedFile?.name + '.webp');
          }, 'image/webp');
      };

      wembpImage.src = URL.createObjectURL(this.uploadedFile);
  } else {
    this.toastr.error(`Type not supported. Supported types are: ${this.allowedImageTypes.join(', ')}.`);
  }
  }

  isValidImage(p_file:File): Boolean {
    const typeProperties = p_file['type'].split('/');
    return typeProperties[0] === 'image' && this.allowedImageTypes.includes(typeProperties[1]);
  }

}
