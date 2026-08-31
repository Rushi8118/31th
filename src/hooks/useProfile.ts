import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase/client'
import { useAuth, UserProfile } from './use-auth'
import { toast } from 'sonner'

export function useProfile() {
  const { user, profile, updateProfile: updateAuthProfile } = useAuth()
  const queryClient = useQueryClient()

  // 1. Update Profile Metadata Mutation
  const updateMetadataMutation = useMutation({
    mutationFn: async (updates: Partial<UserProfile>) => {
      const { data, error } = await updateAuthProfile(updates)
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user_profile', user?.id] })
      toast.success('Profile updated successfully!')
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to update profile settings.')
    },
  })

  // 2. Upload Avatar Image Mutation
  const uploadAvatarMutation = useMutation({
    mutationFn: async (file: File) => {
      if (!user) throw new Error('Not authenticated')

      const fileExt = file.name.split('.').pop()
      const path = `${user.id}/${Date.now()}.${fileExt}`
      const bucketName = 'profile-photos'

      // Upload file to bucket
      const { error: uploadError, data: uploadData } = await supabase.storage
        .from(bucketName)
        .upload(path, file, {
          cacheControl: '3600',
          upsert: true,
        })

      if (uploadError) {
        console.warn('Profile photo bucket upload failed:', uploadError.message)
      }

      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from(bucketName)
        .getPublicUrl(path)

      const profilePhotoUrl = publicUrlData?.publicUrl || ''

      // Save to database
      const { data, error: dbError } = await supabase
        .from('user_profiles')
        .update({ profile_photo_url: profilePhotoUrl })
        .eq('id', user.id)
        .select()
        .single()

      if (dbError) throw dbError
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user_profile', user?.id] })
      toast.success('Profile picture updated successfully!')
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to update profile picture.')
    },
  })

  // 3. Update User Password Mutation (Only email/password)
  const updatePasswordMutation = useMutation({
    mutationFn: async (password: string) => {
      const { error } = await supabase.auth.updateUser({ password })
      if (error) throw error
    },
    onSuccess: () => {
      toast.success('Password updated successfully!')
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to change password.')
    },
  })

  // 4. Delete Account Mutation
  const deleteAccountMutation = useMutation({
    mutationFn: async () => {
      if (!user) return

      // Triggers account deactivation / deletion flag in public table
      // (Supabase admin endpoint requires service role, which is not safe on clients.
      // So we set status to 'deleted' and sign out. RLS blocks further accesses)
      const { error } = await supabase
        .from('user_profiles')
        .update({ status: 'deleted' })
        .eq('id', user.id)

      if (error) throw error
      await supabase.auth.signOut()
    },
    onSuccess: () => {
      toast.success('Your account has been successfully deleted.')
      window.location.href = '/'
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to delete account.')
    },
  })

  return {
    profile,
    updateProfile: updateMetadataMutation.mutate,
    updateLoading: updateMetadataMutation.isPending,
    uploadAvatar: uploadAvatarMutation.mutate,
    uploadLoading: uploadAvatarMutation.isPending,
    updatePassword: updatePasswordMutation.mutate,
    passwordLoading: updatePasswordMutation.isPending,
    deleteAccount: deleteAccountMutation.mutate,
    deleteLoading: deleteAccountMutation.isPending,
  }
}
