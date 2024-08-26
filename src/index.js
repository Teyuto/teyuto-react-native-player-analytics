import axios from 'axios';

const API_URL = 'https://api.teyuto.tv/v1';

class TeyutoAnalytics {
  constructor(channelId, videoId, token = null) {
    this.channelId = channelId;
    this.videoId = videoId;
    this.token = token;
    this.currentAction = null;
    this.secondsPlayed = 0;
    this.firstTimeEnter = true;
    this.updateInterval = null;
    this.player = null;
  }

  async updateTimeVideo(time, end) {
    try {
      const response = await axios.post(
        `${API_URL}/video/?f=action_update`,
        {
          id: this.videoId,
          time: time.toString(),
          action: this.currentAction,
          end: end.toString(),
          sp: this.secondsPlayed.toString(),
        },
        {
          headers: {
            channel: this.channelId,
            ...(this.token && { Authorization: this.token }),
          },
        }
      );

      if (response.status !== 200) {
        throw new Error(`Failed to update time: ${response.data}`);
      }
    } catch (error) {
      console.error('Error updating time:', error);
    }
  }

  async timeEnter(time) {
    try {
      const response = await axios.post(
        `${API_URL}/video/?f=action_enter`,
        {
          id: this.videoId,
          time: time.toString(),
          firstTime: this.firstTimeEnter ? '1' : '0',
        },
        {
          headers: {
            channel: this.channelId,
            ...(this.token && { Authorization: this.token }),
          },
        }
      );

      if (response.status === 200) {
        this.currentAction = response.data[0].action;
        this.firstTimeEnter = false;
      } else {
        throw new Error(`Error on time enter: ${response.data}`);
      }
    } catch (error) {
      console.error('Error on time enter:', error);
    }
  }

  startTracking() {
    this.updateInterval = setInterval(() => {
      this.secondsPlayed += 0.5;
      if (this.secondsPlayed >= 20) {
        this.updateTimeVideo(Math.floor(this.getCurrentTime() * 1000), 0);
        this.secondsPlayed = 0;
      }
    }, 500);
  }

  stopTracking() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }
  }

  onLoad = () => {
    this.timeEnter(0);
  }

  onPlay = () => {
    this.timeEnter(Math.floor(this.getCurrentTime() * 1000));
    this.startTracking();
  }

  onPause = () => {
    this.updateTimeVideo(Math.floor(this.getCurrentTime() * 1000), 1);
    this.stopTracking();
  }

  onEnd = () => {
    this.updateTimeVideo(Math.floor(this.getDuration() * 1000), 1);
    this.stopTracking();
  }

  getCurrentTime() {
    return this.player ? this.player.getCurrentTime() : 0;
  }

  getDuration() {
    return this.player ? this.player.getDuration() : 0;
  }
}

const initializeTeyutoAnalytics = (channelId, videoId, player, token = null) => {
  const analytics = new TeyutoAnalytics(channelId, videoId, token);
  analytics.player = player;

  // Attach event listeners to the player
  player.addEventListener('load', analytics.onLoad);
  player.addEventListener('play', analytics.onPlay);
  player.addEventListener('pause', analytics.onPause);
  player.addEventListener('end', analytics.onEnd);

  return {
    destroy: () => {
      analytics.stopTracking();
      // Remove event listeners
      player.removeEventListener('load', analytics.onLoad);
      player.removeEventListener('play', analytics.onPlay);
      player.removeEventListener('pause', analytics.onPause);
      player.removeEventListener('end', analytics.onEnd);
    }
  };
};

export default initializeTeyutoAnalytics;