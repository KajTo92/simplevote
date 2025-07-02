export interface Poll {
  id: string;
  title: string;
  options: PollOption[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  displaySettings?: DisplaySettings;
}

export interface DisplaySettings {
  chartType: 'horizontal' | 'vertical' | 'pie';
  showPercentages: boolean;
  showVoteCounts: boolean;
  blurOptions: boolean;
}

export interface PollOption {
  id: string;
  text: string;
  votes: number;
  color: string;
}

export interface Vote {
  id: string;
  pollId: string;
  optionId: string;
  voterFingerprint: string;
  createdAt: Date;
}

export interface CreatePollRequest {
  title: string;
  options: string[];
}

export interface VoteRequest {
  pollId: string;
  optionId: string;
  voterFingerprint: string;
} 