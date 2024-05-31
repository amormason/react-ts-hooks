import React from 'react';
import { Select, MenuItem, CircularProgress, SelectChangeEvent, styled } from '@mui/material';
import { useQuery } from 'react-query';
import axios from 'axios';

interface Post {
  id: number;
  name: string;
}

const fetchPosts = async (): Promise<Post[]> => {
  const response = await axios.get('https://jsonplaceholder.typicode.com/users');
  return response.data;
};

const fetchDefaultPost = async (): Promise<Post> => {
  const response = await axios.get('https://jsonplaceholder.typicode.com/users/7');
  return response.data;
};

const PostSelect: React.FC = () => {
  const { data: posts, isLoading: postsLoading } = useQuery('posts', fetchPosts);
  const { data: defaultPost, isLoading: defaultPostLoading } = useQuery('defaultPost', fetchDefaultPost);

  const [a, setA] = React.useState<any>({
    selectedPostId: ''
  });

  const CompactSelect = styled(Select)(({ theme }) => ({
    backgroundColor: '#333', // 深灰色背景
    color: '#fff', // 白色文字
    '& .MuiSelect-select': {
      padding: theme.spacing(0.5), // 缩小内边距使其更加紧凑
    },
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: '#555', // 边框颜色
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: '#777', // 悬停时的边框颜色
    },
    '& .MuiSvgIcon-root': {
      color: '#fff', // 下拉箭头颜色
    },
  }));

  const CompactMenuItem = styled(MenuItem)(({ theme }) => ({
    backgroundColor: '#333', // 深灰色背景
    color: '#fff', // 白色文字
    // padding: theme.spacing(1), // 缩小内边距使其更加紧凑
    height: '31px', // 自适应高度
    '&:hover': {
      backgroundColor: '#444', // 悬停时的背景颜色
    },
    '&.Mui-selected': {
      backgroundColor: theme.palette.primary.main,
      '&:hover': {
        backgroundColor: theme.palette.primary.dark,
      },
    },
  }));


  React.useEffect(() => {
    if (defaultPost) {
      setA({
        ...a,
        selectedPostId: defaultPost.id
      });
    }
  }, [defaultPost]);

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setA({
      ...a,
      selectedPostId: event.target.value
    });
  };

  if (postsLoading || defaultPostLoading) {
    return <CircularProgress />;
  }

  return (
    <div>
      <h1>{JSON.stringify(a)}</h1>
      <CompactSelect
        value={a.selectedPostId}
        onChange={(event) => handleChange(event as React.ChangeEvent<{ value: unknown }>)}
        fullWidth
        variant="outlined"
        MenuProps={{
          PaperProps: {
            sx: {
              bgcolor: '#333',
              color: '#fff',
              margin: 0, // 移除上下留白
              '& .MuiList-root': {
                paddingTop: 0,
                paddingBottom: 0,
              },
            },
          },
        }}
      >
        {posts?.map(post => (
          <CompactMenuItem key={post.id} value={post.id}>
            {post.name}
          </CompactMenuItem>
        ))}
      </CompactSelect>
    </div>
  );
};

export default PostSelect;