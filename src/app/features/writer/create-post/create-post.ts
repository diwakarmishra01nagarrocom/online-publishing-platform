import {
  ChangeDetectorRef,
  Component
} from '@angular/core';

import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { RichTextEditor }
  from '../../../shared/components/rich-text-editor/rich-text-editor';

import { ArticleService }
  from '../../../core/services/article';

import { firebaseAuth }
  from '../../../core/firebase/firebase.config';


@Component({
  selector: 'app-create-post',

  imports: [
    ReactiveFormsModule,
    RichTextEditor
  ],

  templateUrl: './create-post.html',
  styleUrl: './create-post.scss'
})
export class CreatePost {

  // Article form
  articleForm: FormGroup;

  // UI states
  isSaving = false;
  successMessage = '';
  errorMessage = '';


  constructor(
    private fb: FormBuilder,
    private articleService: ArticleService,
    private cdr: ChangeDetectorRef
  ) {

    this.articleForm = this.fb.group({

      title: [
        '',
        [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(150)
        ]
      ],

      description: [
        '',
        [
          Validators.required,
          Validators.maxLength(300)
        ]
      ],

      thumbnailUrl: [''],

      content: [
        '',
        Validators.required
      ],

      scheduledAt: [null]

    });
  }


  async saveDraft(): Promise<void> {

    // Get currently logged-in Firebase user
    const user = firebaseAuth.currentUser;

    if (!user) {
      this.errorMessage =
        'You must be logged in to save an article.';

      return;
    }


    try {

      // Start loading
      this.isSaving = true;

      this.successMessage = '';
      this.errorMessage = '';

      // Get values from Reactive Form
      const formValue =
        this.articleForm.getRawValue();


      // Save article into Firestore
      const articleId =
        await this.articleService.createArticle({

          title:
            formValue.title ?? '',

          description:
            formValue.description ?? '',

          content:
            formValue.content ?? '',

          thumbnailUrl:
            formValue.thumbnailUrl ?? '',

          authorId:
            user.uid,

          authorName:
            user.displayName ?? 'Unknown Author',

          status:
            'draft'

        });


      console.log(
        'Draft article ID:',
        articleId
      );


      // Show success message
      this.successMessage =
        'Draft saved successfully.';


    } catch (error) {

      console.error(
        'Error saving draft:',
        error
      );

      this.errorMessage =
        'Unable to save the draft. Please try again.';


    } finally {

      // Stop loading
      this.isSaving = false;

      // Update Angular UI after Firebase async operation
      this.cdr.detectChanges();

    }
  }

   // publish

    async publishArticle(): Promise<void> {

  // Publish requires a valid form
  if (this.articleForm.invalid) {
    this.articleForm.markAllAsTouched();
    return;
  }

  const user = firebaseAuth.currentUser;

  if (!user) {
    this.errorMessage =
      'You must be logged in to publish an article.';
    return;
  }

  try {

    this.isSaving = true;
    this.successMessage = '';
    this.errorMessage = '';

    const formValue =
      this.articleForm.getRawValue();

    const articleId =
      await this.articleService.createArticle({

        title:
          formValue.title ?? '',

        description:
          formValue.description ?? '',

        content:
          formValue.content ?? '',

        thumbnailUrl:
          formValue.thumbnailUrl ?? '',

        authorId:
          user.uid,

        authorName:
          user.displayName ?? 'Unknown Author',

        status:
          'published',

        publishedAt:
          new Date()

      });

    console.log(
      'Published article ID:',
      articleId
    );

    this.successMessage =
      'Article published successfully.';

    // Clear form after successful publication
    this.articleForm.reset();

  } catch (error) {

    console.error(
      'Error publishing article:',
      error
    );

    this.errorMessage =
      'Unable to publish the article. Please try again.';

  } finally {

    this.isSaving = false;

    this.cdr.detectChanges();
  }
}


//====Schedule=================

async scheduleArticle(): Promise<void> {

  if (this.articleForm.invalid) {
    this.articleForm.markAllAsTouched();
    return;
  }

  const user = firebaseAuth.currentUser;

  if (!user) {
    this.errorMessage =
      'You must be logged in to schedule an article.';
    return;
  }

  const formValue = this.articleForm.getRawValue();

  // User must select a schedule date/time
  if (!formValue.scheduledAt) {
    this.errorMessage =
      'Please select a publication date and time.';
    return;
  }

  const scheduledDate =
    new Date(formValue.scheduledAt);

  // Schedule time must be in the future
  if (scheduledDate <= new Date()) {
    this.errorMessage =
      'Scheduled publication time must be in the future.';
    return;
  }

  try {

    this.isSaving = true;
    this.successMessage = '';
    this.errorMessage = '';

    const articleId =
      await this.articleService.createArticle({

        title:
          formValue.title ?? '',

        description:
          formValue.description ?? '',

        content:
          formValue.content ?? '',

        thumbnailUrl:
          formValue.thumbnailUrl ?? '',

        authorId:
          user.uid,

        authorName:
          user.displayName ?? 'Unknown Author',

        status:
          'scheduled',

        scheduledAt:
          scheduledDate

      });

    console.log(
      'Scheduled article ID:',
      articleId
    );

    this.successMessage =
      'Article scheduled successfully.';

    this.articleForm.reset();

  } catch (error) {

    console.error(
      'Error scheduling article:',
      error
    );

    this.errorMessage =
      'Unable to schedule the article. Please try again.';

  } finally {

    this.isSaving = false;
    this.cdr.detectChanges();
  }
}

}