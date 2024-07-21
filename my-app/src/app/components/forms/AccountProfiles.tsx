"use client";

import { useForm } from 'react-hook-form';
import { Button } from "@/app/components/ui/button";
import {
  Form,
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
  FormField,
} from "@/app/components/ui/form";
import { Input } from "@/app/components/ui/input";
import { zodResolver } from '@hookform/resolvers/zod';
import { UserValidation } from '@/app/lib/validations/user';
import Image from 'next/image';
import { ChangeEvent, useState } from 'react';
import { z } from "zod";
import { isBase64Image } from '@/app/lib/utils';
import { useUploadThing } from '@/app/lib/uploadthing';
import { usePathname, useRouter } from "next/navigation";
import { FaLandmark } from 'react-icons/fa';
import { updateUser } from '@/app/lib/actions/user.actions';

interface Props {
  user: {
    id: string;
    objectId: string;
    username: string;
    name: string;
    image: string;
    account_type: string;
  };
  btnTitle: string;
}

const AccountProfile = ({ user, btnTitle }: Props) => {
  const router = useRouter();
  const pathname = usePathname();
  const [files, setFiles] = useState<File[]>([]);
  const { startUpload } = useUploadThing("media");
  
  const form = useForm({
    resolver: zodResolver(UserValidation),
    defaultValues: {
      profile_photo: user?.image || "",
      name: user?.name || "",
      username: user?.username || "",
      account_type: user?.account_type || "",
    }
  });

  const handleImage = (e: ChangeEvent<HTMLInputElement>, fieldChange: (value: string) => void) => {
    e.preventDefault();

    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setFiles(Array.from(e.target.files));

      if (!file.type.includes('image')) return;

      const fileReader = new FileReader();
      fileReader.onload = async (event) => {
        const imageDataUrl = event.target?.result?.toString() || '';
        fieldChange(imageDataUrl);
      };

      fileReader.readAsDataURL(file);
    }
  };

  const onSubmit = async (values: z.infer<typeof UserValidation>) => {
    const blob = values.profile_photo;

    const hasImageChanged = isBase64Image(blob);
    if (hasImageChanged) {
      const imgRes = await startUpload(files);
      console.log("Upload response:", imgRes);

      if (imgRes && imgRes[0]?.fileUrl) {
        values.profile_photo = imgRes[0].fileUrl;
      }
    }

    await updateUser({
      userId: user.id,
      username: values.username,
      name: values.name,
      image: values.profile_photo,
      account_type: values.account_type,
      path: pathname
    })

    if(pathname === '/profile/edit') {
      router.back();
    } else {
      router.push('/');
    }
  }

  return (
    <Form {...form}>
      <form
        className='flex flex-col justify-start gap-10'
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name='profile_photo'
          render={({ field }) => (
            <FormItem>
              <FormLabel className='text-base-semibold text-black'>
                Profile Photo
              </FormLabel>
              <div className='flex items-center gap-4'>
                <div className='flex-shrink-0'>
                  {field.value ? (
                    <Image
                      src={field.value}
                      alt='profile photo'
                      width={96}
                      height={96}
                      priority
                      className='rounded-full object-cover'
                    />
                  ) : (
                    <Image
                      src='/assets/profile.svg'
                      alt='profile photo'
                      width={36}
                      height={36}
                      className='object-cover'
                    />
                  )}
                </div>
                <div className='flex-1'>
                  <FormControl>
                    <Input
                      type='file'
                      accept='image/*'
                      className='account-form_image-input'
                      onChange={(e) => handleImage(e, field.onChange)}
                    />
                  </FormControl>
                </div>
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem className='flex flex-col gap-2'>
              <FormLabel className='text-base-semibold text-black'>
                Name
              </FormLabel>
              <div className='flex items-center gap-3'>
                <FormControl className='flex-1'>
                  <Input
                    type='text'
                    className='account-form_input no-focus'
                    {...field}
                  />
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='username'
          render={({ field }) => (
            <FormItem className='flex w-full flex-col gap-3'>
              <FormLabel className='text-base-semibold text-black'>
                Username
              </FormLabel>
              <FormControl>
                <Input
                  type='text'
                  className='account-form_input no-focus'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='account_type'
          render={({ field }) => (
            <FormItem className='flex flex-col gap-2'>
              <FormLabel className='text-base-semibold text-black'>
                Account Type
              </FormLabel>
              <div className='flex flex-col gap-4 sm:flex-row'>
                <Button
                  type='button'
                  className={`rounded-lg flex items-center border-2 border-slate-300 w-full sm:w-80 h-auto p-4 gap-2 ${
                    field.value === 'landlord' ? 'bg-green-500 text-white' : 'bg-white text-black'
                  }`}
                  onClick={() => field.onChange('landlord')}
                >
                  <div className='flex flex-col items-center gap-2 text-center'>
                    <FaLandmark className='text-2xl' />
                    <div className='font-semibold'>Landlord</div>
                    <div className='text-small-regular text-wrap w-64'>
                      Accept rent online & manage rental
                    </div>
                  </div>
                </Button>
                <Button
                  type='button'
                  className={`rounded-lg flex items-center border-2 border-slate-300 w-full sm:w-80 h-auto p-4 gap-2 ${
                    field.value === 'tenant' ? 'bg-green-500 text-white' : 'bg-white text-black'
                  }`}
                  onClick={() => field.onChange('tenant')}
                >
                  <div className='flex flex-col items-center gap-2 text-center'>
                    <FaLandmark className='text-2xl' />
                    <div className='font-semibold'>Tenant</div>
                    <div className='text-small-regular text-wrap w-64'>
                      Pay rent online and stay more connected with your landlord
                    </div>
                  </div>
                </Button>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button type='submit' className='bg-green-500'>
          {btnTitle}
        </Button>
      </form>
    </Form>
  );
};

export default AccountProfile;
