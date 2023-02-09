import React from 'react';
import {View, Dimensions} from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

export const SkeletonBox = ({height = 130, width = 125, row = 1, col = 1}) => {
  return (
    <SkeletonPlaceholder>
      <View
        style={{
          flexDirection: 'row',
          paddingHorizontal: 10,
          justifyContent: 'space-between',
          marginBottom: 10,
        }}>
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 20,
            paddingVertical: 10,
            height: 100,
            width: 105,
            paddingHorizontal: 20,
          }}
        />
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 20,
            paddingVertical: 10,
            height: 100,
            width: 105,
            paddingHorizontal: 20,
          }}
        />
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 20,
            paddingVertical: 10,
            height: 100,
            width: 105,
            paddingHorizontal: 20,
          }}
        />
      </View>

      <View
        style={{
          flexDirection: 'row',
          paddingHorizontal: 10,
          justifyContent: 'space-between',
          marginBottom: 10,
        }}>
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 20,
            paddingVertical: 10,
            height: 100,
            width: 105,
            paddingHorizontal: 20,
          }}
        />
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 20,
            paddingVertical: 10,
            height: 100,
            width: 105,
            paddingHorizontal: 20,
          }}
        />
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 20,
            paddingVertical: 10,
            height: 100,
            width: 105,
            paddingHorizontal: 20,
          }}
        />
      </View>
      <View
        style={{
          flexDirection: 'row',
          paddingHorizontal: 10,
          justifyContent: 'space-between',
          marginBottom: 10,
        }}>
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 20,
            paddingVertical: 10,
            height: 100,
            width: 105,
            paddingHorizontal: 20,
          }}
        />
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 20,
            paddingVertical: 10,
            height: 100,
            width: 105,
            paddingHorizontal: 20,
          }}
        />
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 20,
            paddingVertical: 10,
            height: 100,
            width: 105,
            paddingHorizontal: 20,
          }}
        />
      </View>
    </SkeletonPlaceholder>
  );
};

export const SkeletonFake = ({row = 5}) => {
  var fakeHistory = [];
  for (let i = 0; i < row; i++) {
    fakeHistory.push(
      <View
        key={i}
        style={{
          flexDirection: 'row',
          marginVertical: 10,
          marginHorizontal: 20,
        }}>
        <View style={{width: 50, height: 30, borderRadius: 50}} />
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <View style={{marginLeft: 20}}>
            <View style={{width: 90, height: 15, borderRadius: 4}} />
            <View
              style={{
                marginTop: 6,
                width: 150,
                height: 15,
                borderRadius: 4,
              }}
            />
            <View
              style={{
                marginTop: 6,
                width: 170,
                height: 15,
                borderRadius: 4,
              }}
            />
            <View
              style={{
                marginTop: 6,
                width: 150,
                height: 15,
                borderRadius: 4,
              }}
            />
          </View>
          <View style={{alignItems: 'flex-end'}}>
            <View style={{width: 90, height: 15, borderRadius: 4}} />
            <View
              style={{marginTop: 6, width: 70, height: 15, borderRadius: 4}}
            />
          </View>
        </View>
      </View>,
    );
  }
  return <SkeletonPlaceholder>{fakeHistory}</SkeletonPlaceholder>;
};

export const SkeletonFakeMenu = ({row = 3}) => {
  var fakeSkeleton = [];
  for (let i = 0; i < row; i++) {
    fakeSkeleton.push(
      <View
        key={i}
        style={{
          // backgroundColor: colorLogo.color4,
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 20,
          width: wp('23%'),
          paddingBottom: 15,
        }}>
        <View
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 50,
            height: 45,
            width: 45,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        />
        <View
          style={{
            marginTop: 10,
            width: 60,
            height: 10,
            borderRadius: 10,
          }}
        />
      </View>,
    );
  }
  return (
    <SkeletonPlaceholder>
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        {fakeSkeleton}
      </View>
    </SkeletonPlaceholder>
  );
};

export const SkeletonFakeList = props => {
  const widthScreen = Dimensions.get('window').width - 20;
  var fakeSkeleton = [];
  for (let i = 0; i < props.row; i++) {
    fakeSkeleton.push(
      <View
        key={i}
        style={{
          marginVertical: 5,
          width: widthScreen,
          height: props.height,
          borderRadius: 10,
        }}
      />,
    );
  }
  return <SkeletonPlaceholder>{fakeSkeleton}</SkeletonPlaceholder>;
};

export const SkeletonFakeImage = props => {
  return (
    <SkeletonPlaceholder>
      <View style={{width: Dimensions.get('window').width, height: 200}} />
    </SkeletonPlaceholder>
  );
};
