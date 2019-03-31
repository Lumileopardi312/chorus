import { Component } from "inferno";

import SongList from "components/organisms/SongList";
import Announcement from "components/organisms/Announcement";

import Http from "utils/Http";

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = { songs: [], from: 0, isLoading: true };

    Promise.all([
      Http.get("/api/latest"),
      Http.get("/lastupdate.json").catch(() => ({}))
    ]).then(([{ roles, songs }, { lastUpdate }]) =>
      this.setState({
        isLoading: false,
        lastUpdate,
        roles,
        songs,
        hasMore: songs.length == 20
      })
    );
  }
  loadMore() {
    const { songs, roles, from } = this.state;
    this.setState({ isLoading: true });
    document.documentElement.scrollTop = document.documentElement.scrollHeight;
    Http.get("/api/latest", { from: from + 20 }).then(
      ({ songs: newSongs, roles: newRoles }) =>
        this.setState({
          isLoading: false,
          hasMore: newSongs.length == 20,
          songs: songs.concat(newSongs),
          roles: Object.assign(roles, newRoles),
          from: from + 20
        })
    );
  }
  render() {
    const { isLoading, roles, songs, hasMore } = this.state;
    return (
      <div>
        <h2 className="GH3__title">Latest charts</h2>
        <Announcement theme="gh3" />
        <SongList
          isLoading={isLoading}
          roles={roles}
          songs={songs}
          hasMore={hasMore}
          onMore={this.loadMore.bind(this)}
        />
      </div>
    );
  }
}