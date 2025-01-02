const CreateComment = () => {
  return (
    <form>
      <textarea name="postComment" id="postComment" rows={5} cols={50} placeholder="コメントを入力してください" />
    </form>
  )
}

export default CreateComment;