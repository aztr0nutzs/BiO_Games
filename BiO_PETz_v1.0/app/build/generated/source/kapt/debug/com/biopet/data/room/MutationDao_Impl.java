package com.biopet.data.room;

import androidx.annotation.NonNull;
import androidx.room.EntityInsertAdapter;
import androidx.room.RoomDatabase;
import androidx.room.util.DBUtil;
import androidx.room.util.SQLiteStatementUtil;
import androidx.sqlite.SQLiteStatement;
import java.lang.Class;
import java.lang.NullPointerException;
import java.lang.Object;
import java.lang.Override;
import java.lang.String;
import java.lang.SuppressWarnings;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import javax.annotation.processing.Generated;
import kotlin.Unit;
import kotlin.coroutines.Continuation;

@Generated("androidx.room.RoomProcessor")
@SuppressWarnings({"unchecked", "deprecation", "removal"})
public final class MutationDao_Impl implements MutationDao {
  private final RoomDatabase __db;

  private final EntityInsertAdapter<MutationEntity> __insertAdapterOfMutationEntity;

  public MutationDao_Impl(@NonNull final RoomDatabase __db) {
    this.__db = __db;
    this.__insertAdapterOfMutationEntity = new EntityInsertAdapter<MutationEntity>() {
      @Override
      @NonNull
      protected String createQuery() {
        return "INSERT OR REPLACE INTO `mutations` (`id`,`state`) VALUES (?,?)";
      }

      @Override
      protected void bind(@NonNull final SQLiteStatement statement,
          @NonNull final MutationEntity entity) {
        if (entity.getId() == null) {
          statement.bindNull(1);
        } else {
          statement.bindText(1, entity.getId());
        }
        if (entity.getState() == null) {
          statement.bindNull(2);
        } else {
          statement.bindText(2, entity.getState());
        }
      }
    };
  }

  @Override
  public Object insertMutation(final MutationEntity mutation,
      final Continuation<? super Unit> $completion) {
    if (mutation == null) throw new NullPointerException();
    return DBUtil.performSuspending(__db, false, true, (_connection) -> {
      __insertAdapterOfMutationEntity.insert(_connection, mutation);
      return Unit.INSTANCE;
    }, $completion);
  }

  @Override
  public Object insertMutations(final List<MutationEntity> mutations,
      final Continuation<? super Unit> $completion) {
    if (mutations == null) throw new NullPointerException();
    return DBUtil.performSuspending(__db, false, true, (_connection) -> {
      __insertAdapterOfMutationEntity.insert(_connection, mutations);
      return Unit.INSTANCE;
    }, $completion);
  }

  @Override
  public Object getAllMutations(final Continuation<? super List<MutationEntity>> $completion) {
    final String _sql = "SELECT * FROM mutations";
    return DBUtil.performSuspending(__db, true, false, (_connection) -> {
      final SQLiteStatement _stmt = _connection.prepare(_sql);
      try {
        final int _columnIndexOfId = SQLiteStatementUtil.getColumnIndexOrThrow(_stmt, "id");
        final int _columnIndexOfState = SQLiteStatementUtil.getColumnIndexOrThrow(_stmt, "state");
        final List<MutationEntity> _result = new ArrayList<MutationEntity>();
        while (_stmt.step()) {
          final MutationEntity _item;
          final String _tmpId;
          if (_stmt.isNull(_columnIndexOfId)) {
            _tmpId = null;
          } else {
            _tmpId = _stmt.getText(_columnIndexOfId);
          }
          final String _tmpState;
          if (_stmt.isNull(_columnIndexOfState)) {
            _tmpState = null;
          } else {
            _tmpState = _stmt.getText(_columnIndexOfState);
          }
          _item = new MutationEntity(_tmpId,_tmpState);
          _result.add(_item);
        }
        return _result;
      } finally {
        _stmt.close();
      }
    }, $completion);
  }

  @NonNull
  public static List<Class<?>> getRequiredConverters() {
    return Collections.emptyList();
  }
}
