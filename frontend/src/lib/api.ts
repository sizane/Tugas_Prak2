import type {
  ApiResponse,
  Flag,
  FlagInput,
  FlagStatus,
  LikeState,
  LoginInput,
  MenuInput,
  MenuItem,
  MenuQuery,
  RegisterInput,
  Review,
  ReviewInput,
  Stall,
  StallInput,
  StallQuery,
  User,
} from '../types/api.ts';
import { http, tokenStorage } from './http.ts';

const data = <T>(response: { data: ApiResponse<T> }): T => response.data.data;

export const authApi = {
  register: (input: RegisterInput): Promise<User> =>
    http.post<ApiResponse<User>>('/auth/register', input).then(data),

  login: async (input: LoginInput): Promise<User> => {
    const res = await http.post<ApiResponse<{ token: string }>>('/auth/login', input);
    tokenStorage.set(res.data.data.token);
    return authApi.me();
  },

  me: (): Promise<User> =>
    http.get<ApiResponse<User>>('/auth/me').then(data).catch((error) => {
      if (error.response?.status === 401) tokenStorage.clear();
      throw error;
    }),

  logout: async (): Promise<void> => {
    tokenStorage.clear();
  },
};

export const stallsApi = {
  listPaged: (params?: StallQuery) =>
  http.get<{ data: Stall[]; meta: { page: number; limit: number; total: number } }>('/stalls', { params }).then((res) => res.data),
  list: (params?: StallQuery) =>
    http.get<ApiResponse<Stall[]>>('/stalls', { params }).then(data),
  get: (id: number) => http.get<ApiResponse<Stall>>(`/stalls/${id}`).then(data),
  create: (input: StallInput) =>
    http.post<ApiResponse<Stall>>('/stalls', input).then(data),
  update: (id: number, input: Partial<StallInput>) =>
    http.put<ApiResponse<Stall>>(`/stalls/${id}`, input).then(data),
  remove: (id: number) => http.delete(`/stalls/${id}`),
};

export const menuApi = {
  list: (params?: MenuQuery): Promise<MenuItem[]> =>
  http.get<ApiResponse<MenuItem[]>>(params?.stallId ? `/stalls/${params.stallId}/menus` : '/menu-items').then(data),
  create: (_input: MenuInput): Promise<MenuItem> => {
    void _input;
    return Promise.reject(new Error('menuApi.create belum diimplementasikan'));
  },
  update: (_id: number, _input: MenuInput): Promise<MenuItem> => {
    void _id;
    void _input;
    return Promise.reject(new Error('menuApi.update belum diimplementasikan'));
  },
  remove: (_id: number): Promise<void> => {
    void _id;
    return Promise.reject(new Error('menuApi.remove belum diimplementasikan'));
  },
};

export const reviewsApi = {
  byStall: (stallId: number) =>
    http.get<ApiResponse<Review[]>>(`/stalls/${stallId}/reviews`).then(data),
  create: (stallId: number, input: ReviewInput) =>
    http.post<ApiResponse<Review>>(`/stalls/${stallId}/reviews`, input).then(data),
  update: (id: number, input: ReviewInput) =>
    http.put<ApiResponse<Review>>(`/reviews/${id}`, input).then(data),
  remove: (id: number) => http.delete(`/reviews/${id}`),
  like: (id: number) =>
    http.post<ApiResponse<LikeState>>(`/reviews/${id}/like`).then(data),
  unlike: (id: number) =>
    http.delete<ApiResponse<LikeState>>(`/reviews/${id}/like`).then(data),
};

export const flagsApi = {
  create: (reviewId: number, input: FlagInput) =>
    http.post<ApiResponse<Flag>>(`/reviews/${reviewId}/flags`, input).then(data),
  list: (status?: FlagStatus) =>
    http.get<ApiResponse<Flag[]>>('/flags', { params: { status } }).then(data),
  updateStatus: (id: number, status: Exclude<FlagStatus, 'pending'>) =>
    http.patch<ApiResponse<Flag>>(`/flags/${id}`, { status }).then(data),
};
