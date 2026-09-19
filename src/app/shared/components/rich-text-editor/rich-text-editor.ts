import {
  AfterViewInit,
  Component,
  ElementRef,
  forwardRef,
  OnDestroy,
  ViewChild
} from '@angular/core';

import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR
} from '@angular/forms';

import Quill from 'quill';

@Component({
  selector: 'app-rich-text-editor',
  imports: [],
  templateUrl: './rich-text-editor.html',
  styleUrl: './rich-text-editor.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RichTextEditor),
      multi: true
    }
  ]
})
export class RichTextEditor
  implements AfterViewInit, OnDestroy, ControlValueAccessor {

  @ViewChild('editor')
  editorElement!: ElementRef<HTMLDivElement>;

  private quill!: Quill;

  private value = '';

  private onChange: (value: string) => void = () => {};

  private onTouched: () => void = () => {};

  ngAfterViewInit(): void {

    this.quill = new Quill(
      this.editorElement.nativeElement,
      {
        theme: 'snow',

        placeholder: 'Start writing your article...',

        modules: {
          toolbar: [
            ['bold', 'italic', 'underline'],

            [
              { header: 1 },
              { header: 2 }
            ],

            [
              { list: 'ordered' },
              { list: 'bullet' }
            ],

            ['link', 'image', 'video'],

            ['clean']
          ]
        }
      }
    );

    if (this.value) {
      this.quill.clipboard.dangerouslyPasteHTML(this.value);
    }

    this.quill.on('text-change', () => {

      const html =
        this.editorElement.nativeElement
          .querySelector('.ql-editor')
          ?.innerHTML ?? '';

      this.value = html;

      this.onChange(html);
    });

    this.quill.on('selection-change', (range) => {
      if (range === null) {
        this.onTouched();
      }
    });
  }

  writeValue(value: string): void {

    this.value = value ?? '';

    if (this.quill) {
      this.quill.clipboard.dangerouslyPasteHTML(this.value);
    }
  }

  registerOnChange(
    fn: (value: string) => void
  ): void {
    this.onChange = fn;
  }

  registerOnTouched(
    fn: () => void
  ): void {
    this.onTouched = fn;
  }

  setDisabledState(disabled: boolean): void {

    if (this.quill) {
      this.quill.enable(!disabled);
    }
  }

  ngOnDestroy(): void {
    // Quill does not require explicit destruction here.
  }
}