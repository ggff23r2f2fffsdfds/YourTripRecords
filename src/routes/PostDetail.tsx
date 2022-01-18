import React, { useContext, useEffect, useState, useCallback } from 'react';
import { RouteComponentProps, useHistory } from 'react-router-dom';
import styled from 'styled-components';
import Navigation from '../components/Navigation/Navigation';
import Comment from '../components/Detail/Comment';
import Hashtag from '../components/Detail/Hashtag';
import Preview from '../components/Detail/Preview';
import PostInfo from '../components/Detail/PostInfo';
import { UserContext } from '../Context';
import { firebaseFireStore } from '../firebaseConfig';
import PostDetailEdit from '../components/Detail/PostDetailEdit';
import Footer from '../components/Home/Footer';
import Loading from '../components/Load/Loading';

const DetailContainer = styled.main`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  max-width: 1450px;
  margin: 0 auto;
`;

const DetailWrap = styled.article`
  @media (max-width: 1024px) {
    width: 80vw;
  }
  @media (max-width: 768px) {
    width: 95vw;
  }
  width: 65vw;
  padding: 80px 0;
`;

const DetailHeaderWrap = styled.header`
  @media (max-width: 500px) {
    flex-direction: column;
    justify-content: center;
  }
  width: 100%;
  height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const PostTitleWrap = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  & h2 {
    @media (max-width: 768px) {
      font-size: 20px;
    }
    font-size: 24px;
    white-space: pre;
  }
`;

const PostCreatedWrap = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  justify-content: flex-end;
  gap: 0 10px;
  align-items: center;
`;

const PostCreated = styled.span`
  width: 100%;
  color: gray;
  text-align: right;
`;

const DetailInfoWrap = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

interface MatchProps {
  postId: string;
  pathName: string;
}

const PostDetail: React.FC<RouteComponentProps<MatchProps, {}>> = ({
  match,
}) => {
  const { userObj, refreshUser }: any = useContext(UserContext);
  const [postObj, setPostObj] = useState<IPost | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const history = useHistory();
  const { postId } = match.params;
  const pathName = match.url;

  const handleDeletePost = () => {
    const answer = window.confirm(
      '삭제 후 다시 복구할 수 없습니다.\n작성한 게시물을 삭제하시겠습니까?',
    );
    if (answer) {
      setIsLoading(true);
      firebaseFireStore
        .collection('records')
        .doc(postId)
        .delete()
        .then(() => userPostDelete(userObj.userId, postId))
        .then(() => {
          refreshUser(true);
          alert('게시물이 정상적으로 삭제되었습니다.');
          setIsLoading(false);
          postObj && history.push(`/city/${postObj.city}`);
        })
        .catch((error) => {
          console.log(error);
          setIsLoading(false);
          alert('게시물 삭제에 실패하였습니다.');
        });
    }
  };

  const userPostDelete = async (userId: string, postId: string) => {
    const newRecords = userObj.records.filter(
      (record: string) => record !== postId,
    );

    await firebaseFireStore
      .collection('users')
      .doc(userId)
      .update({
        records: [...newRecords],
      })
      .catch((error) => console.log(error));
  };

  const fetchPosts = useCallback(() => {
    const postsRef = firebaseFireStore.collection('records').doc(postId);
    postsRef
      .get()
      .then((doc) => {
        const postData: any = {
          postId,
          ...doc.data(),
        };
        setPostObj(postData);
      })
      .catch((error) => console.log(error));
  }, [postId]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  return (
    <>
      <Navigation show={true} />
      {postObj && (
        <DetailContainer>
          <DetailWrap>
            {isLoading ? (
              <Loading />
            ) : (
              <>
                <DetailHeaderWrap>
                  <PostTitleWrap>
                    <h2>{postObj.postTitle}</h2>
                  </PostTitleWrap>
                  <PostCreatedWrap>
                    <PostCreated>게시일 : {postObj.createdAt}</PostCreated>
                    {userObj.userId === postObj.creator.userObj.userId && (
                      <PostDetailEdit
                        userObj={userObj}
                        postObj={postObj}
                        handleDeletePost={handleDeletePost}
                      />
                    )}
                  </PostCreatedWrap>
                </DetailHeaderWrap>
                <DetailInfoWrap>
                  <Preview postObj={postObj} pathName={pathName} />
                  <PostInfo postObj={postObj} />
                  {postObj.hashtags && <Hashtag postObj={postObj} />}
                  <Comment postId={postObj.postId} />
                </DetailInfoWrap>
              </>
            )}
          </DetailWrap>
          <Footer />
        </DetailContainer>
      )}
    </>
  );
};

export default PostDetail;