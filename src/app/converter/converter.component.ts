import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
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
  uploadedFiles: File[] | undefined = undefined;
  fileSelected = false;
  
  onFileSelected(event: any) {
    this.uploadedFiles = event.target.files;   
    this.fileSelected = true;   
  }

  convertFiles(){
    if (this.uploadedFiles) {
      for (const file of this.uploadedFiles) {
        if(this.isValidImage(file)){
          const formData = new FormData();
          formData.append("thumbnail", file);
    
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
                    FileSaver.saveAs(blob, file.name.replace(/\.[^.]*$/,'') + '.webp');
              }, 'image/webp');
              this.toastr.success(`${file.name} image was successfully converted to webp.`);
          };
          wembpImage.src = URL.createObjectURL(file);

        } else {
          this.toastr.error(`Type not supported for ${file.name}. Supported types are: ${this.allowedImageTypes.join(', ')}.`);
        }
      }
    } 
  }

  isValidImage(p_file:File): Boolean {
    const typeProperties = p_file['type'].split('/');
    return typeProperties[0] === 'image' && this.allowedImageTypes.includes(typeProperties[1]);
  }

}
