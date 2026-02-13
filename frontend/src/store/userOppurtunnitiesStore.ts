import { axiosInstance } from "@/lib/axios";
import axios from "axios";
import { create } from "zustand";

interface Opportunity {
  title: string;
  company: string;
  location: string;
  country: string;
  isRemote: boolean;
  description: string;
  applyLink: string;
  source: string;
  postedDate: string;
  salaryMin: number | null;
  salaryMax: number | null;
  matchScore: number;
}

interface UserOppurtunnitiesStore {
  oppurnuties: Opportunity[];
  setOppurnuties: (oppurnuties: Opportunity[]) => void;
  fetchOppurtunnities: (location: string) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

export const useUserOppurtunnitiesStore = create<UserOppurtunnitiesStore>(
  (set, get) => ({
    oppurnuties: [],
    setOppurnuties: (oppurnuties: any[]) => set({ oppurnuties }),
    loading: false,
    setLoading: (loading: boolean) => set({ loading }),
    fetchOppurtunnities: async (location: string) => {
      get().setLoading(true);
      try {
        console.log(location, "location");
        const response = await axiosInstance.post(
          "/oppurtunites/fetch-online-jobs",
          { geography: location },
        );
        const data = await response.data;
        set({
          oppurnuties: data.global.map((item: any) => {
            return {
              title: item.job_title,
              company: item.employer_name,
              location: item.job_city,
              country: item.job_country,
              isRemote: item.job_is_remote,
              description: item.job_description,
              applyLink: item.job_apply_link,
              source: item.source,
              postedDate: item.posted_date,
              salaryMin: item.salary_min,
              salaryMax: item.salary_max,
              matchScore: item.match_score,
            };
          }),
        });
      } catch (error) {
        console.log(error);
      } finally {
        get().setLoading(false);
      }
    },
  }),
);
