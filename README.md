[![badge](https://img.shields.io/twitter/follow/teyuto?style=social)](https://twitter.com/intent/follow?screen_name=teyuto) &nbsp; [![badge](https://img.shields.io/github/stars/Teyuto/teyuto-player-sdk?style=social)](https://github.com/Teyuto/teyuto-player-sdk)
![](https://github.com/Teyuto/.github/blob/production/assets/img/banner.png?raw=true)
<h1 align="center">Teyuto React Native Video Analytics SDK</h1>

[Teyuto](https://teyuto.com) provides a seamless solution for managing all your video distribution needs. Whether you require video distribution in the cloud, on OTT platforms, storage, public OTT platform distribution, or secure intranet distribution, Teyuto puts everything at your fingertips, making the management of your video content effortless.

# Overview

This SDK provides video analytics integration for React Native applications using the Teyuto platform.

## Features

- Easy integration with React Native Video
- Automatic reporting of playback progress to Teyuto
- Support for both authenticated and unauthenticated usage
- Flexible initialization as a method

## Installation

First, ensure you have a React Native video player installed in your project. For example, if using react-native-video:

```bash
npm install react-native-video
```

Then, install the Teyuto analytics SDK:

```bash
npm install teyuto-react-native-analytics
```

Or if you're using yarn:

```bash
yarn add react-native-video
yarn add teyuto-react-native-analytics
```

## Usage

1. Import the SDK and your video player component:

```javascript
import Video from 'react-native-video';
import initializeTeyutoAnalytics from 'teyuto-react-native-analytics';
```

2. Initialize the SDK in your video component:

```jsx
import React, { useRef, useEffect } from 'react';
import Video from 'react-native-video';
import initializeTeyutoAnalytics from 'teyuto-react-native-analytics';

const VideoPlayer = ({ source, channelId, videoId, token }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      const analytics = initializeTeyutoAnalytics(channelId, videoId, videoRef.current, token);

      return () => {
        analytics.destroy();
      };
    }
  }, [channelId, videoId, token]);

  return (
    <Video
      ref={videoRef}
      source={source}
      style={{ width: 300, height: 200 }}
      // other necessary props
    />
  );
};

export default VideoPlayer;
```

## API

### initializeTeyutoAnalytics(channelId, videoId, player, token?)

Initializes the Teyuto analytics for a video player.

- `channelId` (string): Your Teyuto channel ID (required)
- `videoId` (string): The ID of the video being played (required)
- `player` (object): The video player instance (required)
- `token` (string, optional): Authentication token for Teyuto API  (optional)

Returns an object with a `destroy` method to clean up the analytics when no longer needed.

## License

MIT

## Support

For any issues or feature requests, please open an issue on the GitHub repository.
