export interface User {
  id: string;
  email: string;
  username: string;
  userType: string;
  created: Date;
  updatedAt: Date;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  email: string;
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface VerifyEmailDto {
  email: string;
  code: string;
}

export interface ForgotPasswordDto {
  email: string;
  frontendBaseUri: string;
}

export interface ResetPasswordDto {
  token: string;
  newPassword: string;
}


export interface PaginatedResponse {
  songs: Song[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalSongs: number;
    hasMore: boolean;
  };
}


export interface Artist {
  id: string;
  name: string;
  songCount: number;
  likeCount: number;
  songs: Song[];
}

export enum ReportStatus {
  PENDING = 'PENDING',
  REVIEWED = 'REVIEWED',
  RESOLVED = 'RESOLVED',
  REJECTED = 'REJECTED'
}

export enum ReportReason {
  // COPYRIGHT_VIOLATION = 'COPYRIGHT_VIOLATION',
  INAPPROPRIATE_CONTENT = 'INAPPROPRIATE_CONTENT',
  SPAM = 'SPAM',
  INCORRECT_INFORMATION = 'INCORRECT_INFORMATION',
  OTHER = 'OTHER'
}


export interface SongReport {
  id: string;
  songId: string;
  userId: string;
  reason: ReportReason;
  description?: string;
  status: ReportStatus;
  created: Date;
  user?: {
    username: string;
  };
  song?: {
    title: string;
    singer: string;
  };
}

export interface ReportPaginatedResponse {
  reports: SongReport[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalReports: number;
    hasMore: boolean;
  };
}


export interface CreateReportDto {
  reason: ReportReason;
  description?: string;
}

export interface Song {
  id?: string;
  title?: string;
  singer?: string;
  writer?: string;
  body?: string;
  album?: string;
  key?: string;
  tempo?: number;
  userId?: string;
  user?: User;
  createdAt?: Date;
  updatedAt?: Date;
  likeCount?: number;
  viewCount?: number;
  commentCount?: number;
  songLikes?: { userId: string }[];
  savedSongs?: {
    songId?: string,
    userId?: string
  }[];
}

export interface ThiSoProps {
  text: string;
  transpose: number;
  format: string;
}

export interface CreateSongDto {
  title: string;
  singer: string;
  writer: string;
  album: string;
  key?: string;
  tempo?: number;
  body?: string;
  userId?: string;
}

export interface LoginSignupDialogProps {
  className?: string;
}

export interface SongListProps {
  title: string
  songs?: Song[]
  isLoading: boolean
  error: unknown
  queryKey: string
}

export interface ResetPasswordDialogProps {
  isOpen: boolean;
  onClose: () => void;
  token: string;
}

export interface SearchResultsProps {
  query: string;
  onClearSearch: () => void;
}

export interface ControlBarProps {
  onFontDecrease: () => void;
  onFontIncrease: () => void;
  onTransposeDown: () => void;
  onTransposeUp: () => void;
  onAutoScroll: () => void;
  onSpeedDecrease: () => void;
  onSpeedIncrease: () => void;
  isScrolling?: boolean;
  scrollSpeed: number;
  transpose: number;
}

export interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export interface SongCardProps {
  song: Song;
  // stats: SongStats;
  onLike: () => void;
  isLiked: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  canManage?: boolean;
  isLoggedIn?: boolean;
  onSave: () => void;
  isSaved?: boolean;
  userData?: User;
}

export interface SongActionsProps {
  songData: Song | null;
  onLike: () => void;
  isLiked: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  canManage?: boolean;
  className?: string;
  disabled?: boolean;
  isLoggedIn?: boolean;
  onSave: () => void;
  onSaveInclude?: boolean;
  viewCountInclude?: boolean;
  isSaved?: boolean;
  userData?: User;
}

export interface RenderedSongProps {
  songData?: Song | null;
  stats?: {
    viewCount: number;
    likeCount: number;
    commentCount: number;
  };
  onLike?: () => void;
  isLiked?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  canManage?: boolean;
  transposeNumber: number;
  fontSizeNumber: number;
}

export interface EmailVerificationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  email: string;
}

export interface ForgotPasswordDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface ProtectedRouteProps {
  children: React.ReactNode
}

export interface SearchBarProps {
  onSearch: (query: string) => void;
  className?: string;
  initialQuery?: string;
  searchQuery?: string;
  setSearchQuery?: React.Dispatch<React.SetStateAction<string>>;
}

export interface AuthContextType {
  user: User | null
  setUser: React.Dispatch<React.SetStateAction<User | null>>
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, username: string, password: string) => Promise<void>
}
