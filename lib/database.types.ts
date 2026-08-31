// export type Json =
//   | string
//   | number
//   | boolean
//   | null
//   | { [key: string]: Json | undefined }
//   | Json[]

// export interface Database {
//   public: {
//     Tables: {
//       countries: {
//         Row: {
//           id: string
//           code: string
//           name: string
//           slug: string
//           capital: string | null
//           region: string | null
//           subregion: string | null
//           latitude: number | null
//           longitude: number | null
//           currency: string | null
//           currency_code: string | null
//           language: string | null
//           flag_emoji: string | null
//           description: string | null
//           why_study: string | null
//           why_work: string | null
//           lifestyle: string | null
//           cost_of_living: Json | null
//           climate: Json | null
//           images: Json | null
//           visa_stats: Json | null
//           is_active: boolean
//           sort_order: number | null
//           meta_title: string | null
//           meta_desc: string | null
//           created_at: string
//           updated_at: string
//         }
//         Insert: {
//           id?: string
//           code: string
//           name: string
//           slug: string
//           capital?: string | null
//           region?: string | null
//           subregion?: string | null
//           latitude?: number | null
//           longitude?: number | null
//           currency?: string | null
//           currency_code?: string | null
//           language?: string | null
//           flag_emoji?: string | null
//           description?: string | null
//           why_study?: string | null
//           why_work?: string | null
//           lifestyle?: string | null
//           cost_of_living?: Json | null
//           climate?: Json | null
//           images?: Json | null
//           visa_stats?: Json | null
//           is_active?: boolean
//           sort_order?: number | null
//           meta_title?: string | null
//           meta_desc?: string | null
//           created_at?: string
//           updated_at?: string
//         }
//         Update: {
//           id?: string
//           code?: string
//           name?: string
//           slug?: string
//           capital?: string | null
//           region?: string | null
//           subregion?: string | null
//           latitude?: number | null
//           longitude?: number | null
//           currency?: string | null
//           currency_code?: string | null
//           language?: string | null
//           flag_emoji?: string | null
//           description?: string | null
//           why_study?: string | null
//           why_work?: string | null
//           lifestyle?: string | null
//           cost_of_living?: Json | null
//           climate?: Json | null
//           images?: Json | null
//           visa_stats?: Json | null
//           is_active?: boolean
//           sort_order?: number | null
//           meta_title?: string | null
//           meta_desc?: string | null
//           created_at?: string
//           updated_at?: string
//         }
//       }
//       visa_programs: {
//         Row: {
//           id: string
//           country_id: string
//           program_type: string
//           name: string
//           slug: string
//           description: string
//           eligibility: Json | null
//           requirements: Json | null
//           documents_needed: Json | null
//           processing_time: string | null
//           visa_duration: string | null
//           cost_inr: number | null
//           cost_local: number | null
//           cost_currency: string | null
//           success_rate: number | null
//           pathway_to_pr: boolean | null
//           spousal_rights: boolean | null
//           work_while_study: boolean | null
//           post_study_work: string | null
//           popular_sectors: Json | null
//           universities: Json | null
//           faq: Json | null
//           is_active: boolean
//           is_featured: boolean
//           sort_order: number | null
//           meta_title: string | null
//           meta_desc: string | null
//           created_at: string
//           updated_at: string
//         }
//         Insert: {
//           id?: string
//           country_id: string
//           program_type: string
//           name: string
//           slug: string
//           description: string
//           eligibility?: Json | null
//           requirements?: Json | null
//           documents_needed?: Json | null
//           processing_time?: string | null
//           visa_duration?: string | null
//           cost_inr?: number | null
//           cost_local?: number | null
//           cost_currency?: string | null
//           success_rate?: number | null
//           pathway_to_pr?: boolean | null
//           spousal_rights?: boolean | null
//           work_while_study?: boolean | null
//           post_study_work?: string | null
//           popular_sectors?: Json | null
//           universities?: Json | null
//           faq?: Json | null
//           is_active?: boolean
//           is_featured?: boolean
//           sort_order?: number | null
//           meta_title?: string | null
//           meta_desc?: string | null
//           created_at?: string
//           updated_at?: string
//         }
//         Update: {
//           id?: string
//           country_id?: string
//           program_type?: string
//           name?: string
//           slug?: string
//           description?: string
//           eligibility?: Json | null
//           requirements?: Json | null
//           documents_needed?: Json | null
//           processing_time?: string | null
//           visa_duration?: string | null
//           cost_inr?: number | null
//           cost_local?: number | null
//           cost_currency?: string | null
//           success_rate?: number | null
//           pathway_to_pr?: boolean | null
//           spousal_rights?: boolean | null
//           work_while_study?: boolean | null
//           post_study_work?: string | null
//           popular_sectors?: Json | null
//           universities?: Json | null
//           faq?: Json | null
//           is_active?: boolean
//           is_featured?: boolean
//           sort_order?: number | null
//           meta_title?: string | null
//           meta_desc?: string | null
//           created_at?: string
//           updated_at?: string
//         }
//       }
//       user_profiles: {
//         Row: {
//           id: string
//           email: string
//           full_name: string | null
//           first_name: string | null
//           last_name: string | null
//           phone: string | null
//           whatsapp: string | null
//           date_of_birth: string | null
//           gender: string | null
//           nationality: string | null
//           current_city: string | null
//           current_country: string | null
//           preferred_countries: Json | null
//           visa_type_interest: Json | null
//           education_level: string | null
//           field_of_study: string | null
//           work_experience_years: number | null
//           current_job: string | null
//           english_level: string | null
//           ielts_score: number | null
//           pte_score: number | null
//           toefl_score: number | null
//           profile_photo_url: string | null
//           onboarding_complete: boolean | null
//           user_role: string
//           status: string
//           last_login_at: string | null
//           created_at: string
//           updated_at: string
//         }
//         Insert: {
//           id: string
//           email: string
//           full_name?: string | null
//           first_name?: string | null
//           last_name?: string | null
//           phone?: string | null
//           whatsapp?: string | null
//           date_of_birth?: string | null
//           gender?: string | null
//           nationality?: string | null
//           current_city?: string | null
//           current_country?: string | null
//           preferred_countries?: Json | null
//           visa_type_interest?: Json | null
//           education_level?: string | null
//           field_of_study?: string | null
//           work_experience_years?: number | null
//           current_job?: string | null
//           english_level?: string | null
//           ielts_score?: number | null
//           pte_score?: number | null
//           toefl_score?: number | null
//           profile_photo_url?: string | null
//           onboarding_complete?: boolean | null
//           user_role?: string
//           status?: string
//           last_login_at?: string | null
//           created_at?: string
//           updated_at?: string
//         }
//         Update: {
//           id?: string
//           email?: string
//           full_name?: string | null
//           first_name?: string | null
//           last_name?: string | null
//           phone?: string | null
//           whatsapp?: string | null
//           date_of_birth?: string | null
//           gender?: string | null
//           nationality?: string | null
//           current_city?: string | null
//           current_country?: string | null
//           preferred_countries?: Json | null
//           visa_type_interest?: Json | null
//           education_level?: string | null
//           field_of_study?: string | null
//           work_experience_years?: number | null
//           current_job?: string | null
//           english_level?: string | null
//           ielts_score?: number | null
//           pte_score?: number | null
//           toefl_score?: number | null
//           profile_photo_url?: string | null
//           onboarding_complete?: boolean | null
//           user_role?: string
//           status?: string
//           last_login_at?: string | null
//           created_at?: string
//           updated_at?: string
//         }
//       }
//       applications: {
//         Row: {
//           id: string
//           user_id: string
//           visa_program_id: string
//           country_id: string
//           application_type: string
//           status: string
//           priority: string | null
//           personal_info: Json | null
//           education_history: Json | null
//           work_history: Json | null
//           document_checklist: Json | null
//           submitted_at: string | null
//           review_started_at: string | null
//           decision_at: string | null
//           estimated_completion: string | null
//           total_fee_inr: number | null
//           amount_paid: number | null
//           payment_status: string | null
//           assigned_consultant: string | null
//           consultant_notes: string | null
//           meta: Json | null
//           created_at: string
//           updated_at: string
//         }
//         Insert: {
//           id?: string
//           user_id: string
//           visa_program_id: string
//           country_id: string
//           application_type: string
//           status?: string
//           priority?: string | null
//           personal_info?: Json | null
//           education_history?: Json | null
//           work_history?: Json | null
//           document_checklist?: Json | null
//           submitted_at?: string | null
//           review_started_at?: string | null
//           decision_at?: string | null
//           estimated_completion?: string | null
//           total_fee_inr?: number | null
//           amount_paid?: number | null
//           payment_status?: string | null
//           assigned_consultant?: string | null
//           consultant_notes?: string | null
//           meta?: Json | null
//           created_at?: string
//           updated_at?: string
//         }
//         Update: {
//           id?: string
//           user_id?: string
//           visa_program_id?: string
//           country_id?: string
//           application_type?: string
//           status?: string
//           priority?: string | null
//           personal_info?: Json | null
//           education_history?: Json | null
//           work_history?: Json | null
//           document_checklist?: Json | null
//           submitted_at?: string | null
//           review_started_at?: string | null
//           decision_at?: string | null
//           estimated_completion?: string | null
//           total_fee_inr?: number | null
//           amount_paid?: number | null
//           payment_status?: string | null
//           assigned_consultant?: string | null
//           consultant_notes?: string | null
//           meta?: Json | null
//           created_at?: string
//           updated_at?: string
//         }
//       }
//       consultations: {
//         Row: {
//           id: string
//           user_id: string
//           assigned_consultant: string | null
//           consultation_type: string
//           status: string
//           scheduled_at: string
//           duration_minutes: number | null
//           timezone: string | null
//           meeting_link: string | null
//           meeting_platform: string | null
//           topics: Json | null
//           preferred_countries: Json | null
//           user_notes: string | null
//           consultant_notes: string | null
//           follow_up_needed: boolean | null
//           follow_up_date: string | null
//           rating: number | null
//           feedback: string | null
//           created_at: string
//           updated_at: string
//         }
//         Insert: {
//           id?: string
//           user_id: string
//           assigned_consultant?: string | null
//           consultation_type?: string
//           status?: string
//           scheduled_at: string
//           duration_minutes?: number | null
//           timezone?: string | null
//           meeting_link?: string | null
//           meeting_platform?: string | null
//           topics?: Json | null
//           preferred_countries?: Json | null
//           user_notes?: string | null
//           consultant_notes?: string | null
//           follow_up_needed?: boolean | null
//           follow_up_date?: string | null
//           rating?: number | null
//           feedback?: string | null
//           created_at?: string
//           updated_at?: string
//         }
//         Update: {
//           id?: string
//           user_id?: string
//           assigned_consultant?: string | null
//           consultation_type?: string
//           status?: string
//           scheduled_at?: string
//           duration_minutes?: number | null
//           timezone?: string | null
//           meeting_link?: string | null
//           meeting_platform?: string | null
//           topics?: Json | null
//           preferred_countries?: Json | null
//           user_notes?: string | null
//           consultant_notes?: string | null
//           follow_up_needed?: boolean | null
//           follow_up_date?: string | null
//           rating?: number | null
//           feedback?: string | null
//           created_at?: string
//           updated_at?: string
//         }
//       }
//       saved_places: {
//         Row: {
//           id: string
//           user_id: string
//           item_type: string
//           country_id: string | null
//           visa_program_id: string | null
//           notes: string | null
//           created_at: string
//         }
//         Insert: {
//           id?: string
//           user_id: string
//           item_type: string
//           country_id?: string | null
//           visa_program_id?: string | null
//           notes?: string | null
//           created_at?: string
//         }
//         Update: {
//           id?: string
//           user_id?: string
//           item_type?: string
//           country_id?: string | null
//           visa_program_id?: string | null
//           notes?: string | null
//           created_at?: string
//         }
//       }
//       interactions: {
//         Row: {
//           id: string
//           user_id: string | null
//           session_id: string | null
//           event_type: string
//           entity_type: string | null
//           entity_id: string | null
//           page_path: string | null
//           page_title: string | null
//           referrer: string | null
//           device_type: string | null
//           browser: string | null
//           country_code: string | null
//           globe_lat: number | null
//           globe_lng: number | null
//           metadata: Json | null
//           created_at: string
//         }
//         Insert: {
//           id?: string
//           user_id?: string | null
//           session_id?: string | null
//           event_type: string
//           entity_type?: string | null
//           entity_id?: string | null
//           page_path?: string | null
//           page_title?: string | null
//           referrer?: string | null
//           device_type?: string | null
//           browser?: string | null
//           country_code?: string | null
//           globe_lat?: number | null
//           globe_lng?: number | null
//           metadata?: Json | null
//           created_at?: string
//         }
//         Update: {
//           id?: string
//           user_id?: string | null
//           session_id?: string | null
//           event_type?: string
//           entity_type?: string | null
//           entity_id?: string | null
//           page_path?: string | null
//           page_title?: string | null
//           referrer?: string | null
//           device_type?: string | null
//           browser?: string | null
//           country_code?: string | null
//           globe_lat?: number | null
//           globe_lng?: number | null
//           metadata?: Json | null
//           created_at?: string
//         }
//       }
//       blog_posts: {
//         Row: {
//           id: string
//           author_id: string | null
//           title: string
//           slug: string
//           excerpt: string | null
//           content: string
//           category: string
//           tags: Json | null
//           related_countries: Json | null
//           related_programs: Json | null
//           featured_image: string | null
//           cover_video: string | null
//           gallery: Json | null
//           meta_title: string | null
//           meta_desc: string | null
//           keywords: Json | null
//           canonical_url: string | null
//           status: string
//           published_at: string | null
//           scheduled_at: string | null
//           view_count: number
//           like_count: number
//           share_count: number
//           created_at: string
//           updated_at: string
//         }
//         Insert: {
//           id?: string
//           author_id?: string | null
//           title: string
//           slug: string
//           excerpt?: string | null
//           content: string
//           category?: string
//           tags?: Json | null
//           related_countries?: Json | null
//           related_programs?: Json | null
//           featured_image?: string | null
//           cover_video?: string | null
//           gallery?: Json | null
//           meta_title?: string | null
//           meta_desc?: string | null
//           keywords?: Json | null
//           canonical_url?: string | null
//           status?: string
//           published_at?: string | null
//           scheduled_at?: string | null
//           view_count?: number
//           like_count?: number
//           share_count?: number
//           created_at?: string
//           updated_at?: string
//         }
//         Update: {
//           id?: string
//           author_id?: string | null
//           title?: string
//           slug?: string
//           excerpt?: string | null
//           content?: string
//           category?: string
//           tags?: Json | null
//           related_countries?: Json | null
//           related_programs?: Json | null
//           featured_image?: string | null
//           cover_video?: string | null
//           gallery?: Json | null
//           meta_title?: string | null
//           meta_desc?: string | null
//           keywords?: Json | null
//           canonical_url?: string | null
//           status?: string
//           published_at?: string | null
//           scheduled_at?: string | null
//           view_count?: number
//           like_count?: number
//           share_count?: number
//           created_at?: string
//           updated_at?: string
//         }
//       }
//       notifications: {
//         Row: {
//           id: string
//           user_id: string
//           type: string
//           title: string
//           message: string | null
//           action_url: string | null
//           action_label: string | null
//           is_read: boolean
//           read_at: string | null
//           created_at: string
//         }
//         Insert: {
//           id?: string
//           user_id: string
//           type: string
//           title: string
//           message?: string | null
//           action_url?: string | null
//           action_label?: string | null
//           is_read?: boolean
//           read_at?: string | null
//           created_at?: string
//         }
//         Update: {
//           id?: string
//           user_id?: string
//           type?: string
//           title?: string
//           message?: string | null
//           action_url?: string | null
//           action_label?: string | null
//           is_read?: boolean
//           read_at?: string | null
//           created_at?: string
//         }
//       }
//       country_faqs: {
//         Row: {
//           id: string
//           country_id: string
//           question: string
//           answer: string
//           category: string | null
//           sort_order: number | null
//           is_active: boolean | null
//           created_at: string
//         }
//         Insert: {
//           id?: string
//           country_id: string
//           question: string
//           answer: string
//           category?: string | null
//           sort_order?: number | null
//           is_active?: boolean | null
//           created_at?: string
//         }
//         Update: {
//           id?: string
//           country_id?: string
//           question?: string
//           answer?: string
//           category?: string | null
//           sort_order?: number | null
//           is_active?: boolean | null
//           created_at?: string
//         }
//       }
//     }
//     Views: {
//       public_countries: {
//         Row: {
//           id: string
//           code: string
//           name: string
//           slug: string
//           capital: string | null
//           region: string | null
//           subregion: string | null
//           latitude: number | null
//           longitude: number | null
//           currency: string | null
//           currency_code: string | null
//           language: string | null
//           flag_emoji: string | null
//           description: string | null
//           why_study: string | null
//           why_work: string | null
//           lifestyle: string | null
//           cost_of_living: Json | null
//           climate: Json | null
//           images: Json | null
//           visa_stats: Json | null
//           is_active: boolean
//           sort_order: number | null
//           meta_title: string | null
//           meta_desc: string | null
//           created_at: string
//           updated_at: string
//         }
//       }
//       public_visa_programs: {
//         Row: {
//           id: string
//           country_id: string
//           program_type: string
//           name: string
//           slug: string
//           description: string
//           eligibility: Json | null
//           requirements: Json | null
//           documents_needed: Json | null
//           processing_time: string | null
//           visa_duration: string | null
//           cost_inr: number | null
//           cost_local: number | null
//           cost_currency: string | null
//           success_rate: number | null
//           pathway_to_pr: boolean | null
//           spousal_rights: boolean | null
//           work_while_study: boolean | null
//           post_study_work: string | null
//           popular_sectors: Json | null
//           universities: Json | null
//           faq: Json | null
//           is_active: boolean
//           is_featured: boolean
//           sort_order: number | null
//           meta_title: string | null
//           meta_desc: string | null
//           created_at: string
//           updated_at: string
//           country_name: string | null
//           country_slug: string | null
//           flag_emoji: string | null
//         }
//       }
//       featured_programs: {
//         Row: {
//           id: string
//           country_id: string
//           program_type: string
//           name: string
//           slug: string
//           description: string
//           eligibility: Json | null
//           requirements: Json | null
//           documents_needed: Json | null
//           processing_time: string | null
//           visa_duration: string | null
//           cost_inr: number | null
//           cost_local: number | null
//           cost_currency: string | null
//           success_rate: number | null
//           pathway_to_pr: boolean | null
//           spousal_rights: boolean | null
//           work_while_study: boolean | null
//           post_study_work: string | null
//           popular_sectors: Json | null
//           universities: Json | null
//           faq: Json | null
//           is_active: boolean
//           is_featured: boolean
//           sort_order: number | null
//           meta_title: string | null
//           meta_desc: string | null
//           created_at: string
//           updated_at: string
//           country_name: string | null
//           country_slug: string | null
//           flag_emoji: string | null
//         }
//       }
//       user_dashboard_summary: {
//         Row: {
//           user_id: string | null
//           full_name: string | null
//           email: string | null
//           total_applications: number | null
//           active_applications: number | null
//           total_consultations: number | null
//           saved_count: number | null
//           unread_notifications: number | null
//         }
//       }
//     }
//     Functions: {
//       increment_blog_views: {
//         Args: { post_id: string }
//         Returns: void
//       }
//     }
//     Enums: {}
//   }
// }


export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      countries: {
        Row: {
          id: string
          code: string
          name: string
          slug: string
          capital: string | null
          region: string | null
          subregion: string | null
          latitude: number | null
          longitude: number | null
          currency: string | null
          currency_code: string | null
          language: string | null
          flag_emoji: string | null
          description: string | null
          why_study: string | null
          why_work: string | null
          lifestyle: string | null
          cost_of_living: Json | null
          climate: Json | null
          images: Json | null
          visa_stats: Json | null
          is_active: boolean
          sort_order: number | null
          meta_title: string | null
          meta_desc: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          code: string
          name: string
          slug: string
          capital?: string | null
          region?: string | null
          subregion?: string | null
          latitude?: number | null
          longitude?: number | null
          currency?: string | null
          currency_code?: string | null
          language?: string | null
          flag_emoji?: string | null
          description?: string | null
          why_study?: string | null
          why_work?: string | null
          lifestyle?: string | null
          cost_of_living?: Json | null
          climate?: Json | null
          images?: Json | null
          visa_stats?: Json | null
          is_active?: boolean
          sort_order?: number | null
          meta_title?: string | null
          meta_desc?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          code?: string
          name?: string
          slug?: string
          capital?: string | null
          region?: string | null
          subregion?: string | null
          latitude?: number | null
          longitude?: number | null
          currency?: string | null
          currency_code?: string | null
          language?: string | null
          flag_emoji?: string | null
          description?: string | null
          why_study?: string | null
          why_work?: string | null
          lifestyle?: string | null
          cost_of_living?: Json | null
          climate?: Json | null
          images?: Json | null
          visa_stats?: Json | null
          is_active?: boolean
          sort_order?: number | null
          meta_title?: string | null
          meta_desc?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      visa_programs: {
        Row: {
          id: string
          country_id: string
          program_type: string
          name: string
          slug: string
          description: string
          eligibility: Json | null
          requirements: Json | null
          documents_needed: Json | null
          processing_time: string | null
          visa_duration: string | null
          cost_inr: number | null
          cost_local: number | null
          cost_currency: string | null
          success_rate: number | null
          pathway_to_pr: boolean | null
          spousal_rights: boolean | null
          work_while_study: boolean | null
          post_study_work: string | null
          popular_sectors: Json | null
          universities: Json | null
          faq: Json | null
          is_active: boolean
          is_featured: boolean
          sort_order: number | null
          meta_title: string | null
          meta_desc: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          country_id: string
          program_type: string
          name: string
          slug: string
          description: string
          eligibility?: Json | null
          requirements?: Json | null
          documents_needed?: Json | null
          processing_time?: string | null
          visa_duration?: string | null
          cost_inr?: number | null
          cost_local?: number | null
          cost_currency?: string | null
          success_rate?: number | null
          pathway_to_pr?: boolean | null
          spousal_rights?: boolean | null
          work_while_study?: boolean | null
          post_study_work?: string | null
          popular_sectors?: Json | null
          universities?: Json | null
          faq?: Json | null
          is_active?: boolean
          is_featured?: boolean
          sort_order?: number | null
          meta_title?: string | null
          meta_desc?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          country_id?: string
          program_type?: string
          name?: string
          slug?: string
          description?: string
          eligibility?: Json | null
          requirements?: Json | null
          documents_needed?: Json | null
          processing_time?: string | null
          visa_duration?: string | null
          cost_inr?: number | null
          cost_local?: number | null
          cost_currency?: string | null
          success_rate?: number | null
          pathway_to_pr?: boolean | null
          spousal_rights?: boolean | null
          work_while_study?: boolean | null
          post_study_work?: string | null
          popular_sectors?: Json | null
          universities?: Json | null
          faq?: Json | null
          is_active?: boolean
          is_featured?: boolean
          sort_order?: number | null
          meta_title?: string | null
          meta_desc?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      user_profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          first_name: string | null
          last_name: string | null
          username: string | null
          welcome_email_sent_at: string | null
          phone: string | null
          whatsapp: string | null
          gender: string | null
          nationality: string | null
          current_city: string | null
          current_country: string | null
          education_level: string | null
          field_of_study: string | null
          profile_photo_url: string | null
          onboarding_complete: boolean | null
          user_role: string
          status: string
          last_login_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          first_name?: string | null
          last_name?: string | null
          username?: string | null
          welcome_email_sent_at?: string | null
          phone?: string | null
          whatsapp?: string | null
          gender?: string | null
          nationality?: string | null
          current_city?: string | null
          current_country?: string | null
          education_level?: string | null
          field_of_study?: string | null
          profile_photo_url?: string | null
          onboarding_complete?: boolean | null
          user_role?: string
          status?: string
          last_login_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          first_name?: string | null
          last_name?: string | null
          username?: string | null
          welcome_email_sent_at?: string | null
          phone?: string | null
          whatsapp?: string | null
          gender?: string | null
          nationality?: string | null
          current_city?: string | null
          current_country?: string | null
          education_level?: string | null
          field_of_study?: string | null
          profile_photo_url?: string | null
          onboarding_complete?: boolean | null
          user_role?: string
          status?: string
          last_login_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      applications: {
        Row: {
          id: string
          application_id: string | null
          user_id: string
          visa_program_id: string
          country_id: string
          application_type: string
          status: string
          priority: string | null
          personal_info: Json | null
          education_history: Json | null
          work_history: Json | null
          document_checklist: Json | null
          submitted_at: string | null
          review_started_at: string | null
          decision_at: string | null
          estimated_completion: string | null
          assigned_consultant: string | null
          consultant_notes: string | null
          meta: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          application_id?: string | null
          user_id: string
          visa_program_id: string
          country_id: string
          application_type: string
          status?: string
          priority?: string | null
          personal_info?: Json | null
          education_history?: Json | null
          work_history?: Json | null
          document_checklist?: Json | null
          submitted_at?: string | null
          review_started_at?: string | null
          decision_at?: string | null
          estimated_completion?: string | null
          assigned_consultant?: string | null
          consultant_notes?: string | null
          meta?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          application_id?: string | null
          user_id?: string
          visa_program_id?: string
          country_id?: string
          application_type?: string
          status?: string
          priority?: string | null
          personal_info?: Json | null
          education_history?: Json | null
          work_history?: Json | null
          document_checklist?: Json | null
          submitted_at?: string | null
          review_started_at?: string | null
          decision_at?: string | null
          estimated_completion?: string | null
          assigned_consultant?: string | null
          consultant_notes?: string | null
          meta?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
      consultations: {
        Row: {
          id: string
          user_id: string | null
          assigned_consultant: string | null
          consultation_type: string
          status: string
          scheduled_at: string
          duration_minutes: number | null
          timezone: string | null
          phone_number: string | null
          whatsapp_number: string | null
          preferred_country: string | null
          visa_category: string | null
          user_notes: Json | null
          consultant_notes: string | null
          follow_up_needed: boolean | null
          follow_up_date: string | null
          rating: number | null
          feedback: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          assigned_consultant?: string | null
          consultation_type?: string
          status?: string
          scheduled_at?: string
          duration_minutes?: number | null
          timezone?: string | null
          phone_number?: string | null
          whatsapp_number?: string | null
          preferred_country?: string | null
          visa_category?: string | null
          user_notes?: Json | null
          consultant_notes?: string | null
          follow_up_needed?: boolean | null
          follow_up_date?: string | null
          rating?: number | null
          feedback?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          assigned_consultant?: string | null
          consultation_type?: string
          status?: string
          scheduled_at?: string
          duration_minutes?: number | null
          timezone?: string | null
          phone_number?: string | null
          whatsapp_number?: string | null
          preferred_country?: string | null
          visa_category?: string | null
          user_notes?: Json | null
          consultant_notes?: string | null
          follow_up_needed?: boolean | null
          follow_up_date?: string | null
          rating?: number | null
          feedback?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      saved_places: {
        Row: {
          id: string
          user_id: string
          item_type: string
          country_id: string | null
          visa_program_id: string | null
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          item_type: string
          country_id?: string | null
          visa_program_id?: string | null
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          item_type?: string
          country_id?: string | null
          visa_program_id?: string | null
          notes?: string | null
          created_at?: string
        }
      }
      interactions: {
        Row: {
          id: string
          user_id: string | null
          session_id: string | null
          event_type: string
          entity_type: string | null
          entity_id: string | null
          page_path: string | null
          page_title: string | null
          referrer: string | null
          device_type: string | null
          browser: string | null
          country_code: string | null
          globe_lat: number | null
          globe_lng: number | null
          metadata: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          session_id?: string | null
          event_type: string
          entity_type?: string | null
          entity_id?: string | null
          page_path?: string | null
          page_title?: string | null
          referrer?: string | null
          device_type?: string | null
          browser?: string | null
          country_code?: string | null
          globe_lat?: number | null
          globe_lng?: number | null
          metadata?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          session_id?: string | null
          event_type?: string
          entity_type?: string | null
          entity_id?: string | null
          page_path?: string | null
          page_title?: string | null
          referrer?: string | null
          device_type?: string | null
          browser?: string | null
          country_code?: string | null
          globe_lat?: number | null
          globe_lng?: number | null
          metadata?: Json | null
          created_at?: string
        }
      }
      blog_posts: {
        Row: {
          id: string
          author_id: string | null
          title: string
          slug: string
          excerpt: string | null
          content: string
          category: string
          tags: Json | null
          related_countries: Json | null
          related_programs: Json | null
          featured_image: string | null
          gallery: Json | null
          meta_title: string | null
          meta_desc: string | null
          keywords: Json | null
          canonical_url: string | null
          status: string
          published_at: string | null
          scheduled_at: string | null
          view_count: number
          like_count: number
          share_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          author_id?: string | null
          title: string
          slug: string
          excerpt?: string | null
          content: string
          category?: string
          tags?: Json | null
          related_countries?: Json | null
          related_programs?: Json | null
          featured_image?: string | null
          gallery?: Json | null
          meta_title?: string | null
          meta_desc?: string | null
          keywords?: Json | null
          canonical_url?: string | null
          status?: string
          published_at?: string | null
          scheduled_at?: string | null
          view_count?: number
          like_count?: number
          share_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          author_id?: string | null
          title?: string
          slug?: string
          excerpt?: string | null
          content?: string
          category?: string
          tags?: Json | null
          related_countries?: Json | null
          related_programs?: Json | null
          featured_image?: string | null
          gallery?: Json | null
          meta_title?: string | null
          meta_desc?: string | null
          keywords?: Json | null
          canonical_url?: string | null
          status?: string
          published_at?: string | null
          scheduled_at?: string | null
          view_count?: number
          like_count?: number
          share_count?: number
          created_at?: string
          updated_at?: string
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          type: string
          title: string
          message: string | null
          action_url: string | null
          action_label: string | null
          is_read: boolean
          read_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: string
          title: string
          message?: string | null
          action_url?: string | null
          action_label?: string | null
          is_read?: boolean
          read_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: string
          title?: string
          message?: string | null
          action_url?: string | null
          action_label?: string | null
          is_read?: boolean
          read_at?: string | null
          created_at?: string
        }
      }
      country_faqs: {
        Row: {
          id: string
          country_id: string
          question: string
          answer: string
          category: string | null
          sort_order: number | null
          is_active: boolean | null
          created_at: string
        }
        Insert: {
          id?: string
          country_id: string
          question: string
          answer: string
          category?: string | null
          sort_order?: number | null
          is_active?: boolean | null
          created_at?: string
        }
        Update: {
          id?: string
          country_id?: string
          question?: string
          answer?: string
          category?: string | null
          sort_order?: number | null
          is_active?: boolean | null
          created_at?: string
        }
      }
    }
    Views: {
      public_countries: {
        Row: {
          id: string
          code: string
          name: string
          slug: string
          capital: string | null
          region: string | null
          subregion: string | null
          latitude: number | null
          longitude: number | null
          currency: string | null
          currency_code: string | null
          language: string | null
          flag_emoji: string | null
          description: string | null
          why_study: string | null
          why_work: string | null
          lifestyle: string | null
          cost_of_living: Json | null
          climate: Json | null
          images: Json | null
          visa_stats: Json | null
          is_active: boolean
          sort_order: number | null
          meta_title: string | null
          meta_desc: string | null
          created_at: string
          updated_at: string
        }
      }
      public_visa_programs: {
        Row: {
          id: string
          country_id: string
          program_type: string
          name: string
          slug: string
          description: string
          eligibility: Json | null
          requirements: Json | null
          documents_needed: Json | null
          processing_time: string | null
          visa_duration: string | null
          cost_inr: number | null
          cost_local: number | null
          cost_currency: string | null
          success_rate: number | null
          pathway_to_pr: boolean | null
          spousal_rights: boolean | null
          work_while_study: boolean | null
          post_study_work: string | null
          popular_sectors: Json | null
          universities: Json | null
          faq: Json | null
          is_active: boolean
          is_featured: boolean
          sort_order: number | null
          meta_title: string | null
          meta_desc: string | null
          created_at: string
          updated_at: string
          country_name: string | null
          country_slug: string | null
          flag_emoji: string | null
        }
      }
      featured_programs: {
        Row: {
          id: string
          country_id: string
          program_type: string
          name: string
          slug: string
          description: string
          eligibility: Json | null
          requirements: Json | null
          documents_needed: Json | null
          processing_time: string | null
          visa_duration: string | null
          cost_inr: number | null
          cost_local: number | null
          cost_currency: string | null
          success_rate: number | null
          pathway_to_pr: boolean | null
          spousal_rights: boolean | null
          work_while_study: boolean | null
          post_study_work: string | null
          popular_sectors: Json | null
          universities: Json | null
          faq: Json | null
          is_active: boolean
          is_featured: boolean
          sort_order: number | null
          meta_title: string | null
          meta_desc: string | null
          created_at: string
          updated_at: string
          country_name: string | null
          country_slug: string | null
          flag_emoji: string | null
        }
      }
      user_dashboard_summary: {
        Row: {
          user_id: string | null
          full_name: string | null
          email: string | null
          total_applications: number | null
          active_applications: number | null
          total_consultations: number | null
          saved_count: number | null
          unread_notifications: number | null
        }
      }
    }
    Functions: {
      increment_blog_views: {
        Args: { post_id: string }
        Returns: void
      }
    }
    Enums: {}
  }
}
